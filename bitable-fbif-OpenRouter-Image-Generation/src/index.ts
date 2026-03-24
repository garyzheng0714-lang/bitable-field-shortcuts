import {
  basekit,
  FieldType,
  FieldComponent,
  FieldCode
} from '@lark-opdev/block-basekit-server-api';
import CryptoJS from 'crypto-js';

basekit.addDomainList([
  'openrouter.ai',
  'open.feishu.cn',
  'open.larksuite.com',
  'fbif-feishu-base.oss-cn-shanghai.aliyuncs.com'
]);

const DEFAULT_MODEL = 'google/gemini-3-pro-image-preview';
const DEFAULT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OSS_ACCESS_KEY_ID = 'REPLACE_WITH_OSS_ACCESS_KEY_ID';
const OSS_ACCESS_KEY_SECRET = 'REPLACE_WITH_OSS_ACCESS_KEY_SECRET';
const OSS_BUCKET = 'fbif-feishu-base';
const OSS_DOMAIN = 'fbif-feishu-base.oss-cn-shanghai.aliyuncs.com';
const OSS_OBJECT_PREFIX = 'bitable-openrouter-images';
const OSS_REFERENCE_OBJECT_PREFIX = 'bitable-openrouter-reference';
const OSS_REFERENCE_SIGNED_EXPIRES_SECONDS = 1800;
const MAX_REFERENCE_IMAGE_INPUTS = 8;
const MAX_ATTACHMENT_OUTPUTS = 5;
const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

interface UploadCapableFieldContext {
  logID?: string;
  token?: string;
  packID?: string;
  tenantKey?: string;
  timeZone?: string;
  tenantAccessToken?: string;
  fetch: (url: string, init?: any, authorizationId?: string) => Promise<any>;
}

function getSelectValue(value: any): string {
  if (value && typeof value === 'object' && typeof value.value === 'string') {
    return value.value;
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

function getText(value: any): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
}

function splitDelimitedValues(value: string): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(/[\n,，]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSupportedReferenceUrl(value: string): boolean {
  return /^https?:\/\/|^data:image\//i.test(value.trim());
}

function extractUrlCandidatesFromText(value: string): string[] {
  const text = value.trim();
  if (!text) {
    return [];
  }

  const urls: string[] = [];
  const pushIfValid = (candidate: string) => {
    if (isSupportedReferenceUrl(candidate)) {
      urls.push(candidate.trim());
    }
  };

  const regexMatches = text.match(/https?:\/\/[^\s,，]+/gi) || [];
  for (const item of regexMatches) {
    pushIfValid(item);
  }

  const splitMatches = splitDelimitedValues(text);
  for (const item of splitMatches) {
    pushIfValid(item);
  }

  return Array.from(new Set(urls));
}

function toOptionalNumber(value: any): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return undefined;
}

function toOptionalInteger(value: any): number | undefined {
  const parsed = toOptionalNumber(value);
  if (parsed === undefined) {
    return undefined;
  }
  return Math.floor(parsed);
}

function parseMessageText(message: any): string {
  if (!message) {
    return '';
  }

  if (typeof message.content === 'string') {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    const chunks: string[] = [];
    for (const item of message.content) {
      if (item && typeof item.text === 'string') {
        chunks.push(item.text);
      }
    }
    return chunks.join('\n').trim();
  }

  return '';
}

function parseImageUrls(message: any): string[] {
  const urls: string[] = [];

  const pushUrl = (candidate: any) => {
    if (typeof candidate === 'string' && candidate.trim()) {
      urls.push(candidate.trim());
    }
  };

  if (Array.isArray(message?.images)) {
    for (const item of message.images) {
      pushUrl(item?.image_url?.url || item?.url);
    }
  }

  if (Array.isArray(message?.content)) {
    for (const item of message.content) {
      if (!item || typeof item !== 'object') {
        continue;
      }
      if (item.type === 'image_url' || item.type === 'output_image') {
        pushUrl(item.image_url?.url || item.url);
      }
    }
  }

  if (message?.image_url?.url) {
    pushUrl(message.image_url.url);
  }

  return Array.from(new Set(urls));
}

function parseDataUrl(value: string): { mimeType: string; base64: string } | null {
  const match = /^data:([^;,]+);base64,(.+)$/i.exec(value);
  if (!match) {
    return null;
  }
  return {
    mimeType: match[1],
    base64: match[2]
  };
}

function extractAttachmentTmpUrls(value: any): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const urls: string[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const tmpUrl = typeof item.tmp_url === 'string' ? item.tmp_url.trim() : '';
    if (tmpUrl) {
      urls.push(tmpUrl);
    }
  }
  return urls;
}

function extractReferenceImageUrlsFromFieldValue(value: any): string[] {
  const urls: string[] = [];
  const pushUrl = (candidate: string) => {
    if (isSupportedReferenceUrl(candidate)) {
      urls.push(candidate.trim());
    }
  };

  const visited = new Set<any>();
  const walk = (node: any, depth: number) => {
    if (node === null || node === undefined || depth > 5) {
      return;
    }

    if (typeof node === 'string') {
      for (const item of extractUrlCandidatesFromText(node)) {
        pushUrl(item);
      }
      return;
    }

    if (typeof node !== 'object') {
      return;
    }

    if (visited.has(node)) {
      return;
    }
    visited.add(node);

    if (Array.isArray(node)) {
      for (const item of extractAttachmentTmpUrls(node)) {
        pushUrl(item);
      }
      for (const item of node) {
        walk(item, depth + 1);
      }
      return;
    }

    if (typeof node.tmp_url === 'string') {
      pushUrl(node.tmp_url);
    }
    if (typeof node.link === 'string') {
      pushUrl(node.link);
    }
    if (typeof node.url === 'string') {
      pushUrl(node.url);
    }
    if (typeof node.text === 'string') {
      for (const item of extractUrlCandidatesFromText(node.text)) {
        pushUrl(item);
      }
    }
    if (typeof node.value === 'string') {
      for (const item of extractUrlCandidatesFromText(node.value)) {
        pushUrl(item);
      }
    }

    for (const child of Object.values(node)) {
      walk(child, depth + 1);
    }
  };

  walk(value, 0);
  return Array.from(new Set(urls));
}

function inferExt(mimeType: string): string {
  const normalized = mimeType.toLowerCase();
  if (normalized.includes('png')) return 'png';
  if (normalized.includes('jpeg') || normalized.includes('jpg')) return 'jpg';
  if (normalized.includes('webp')) return 'webp';
  if (normalized.includes('gif')) return 'gif';
  return 'bin';
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function encodeOssObjectKey(objectKey: string): string {
  return objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function signOssV1Base64(stringToSign: string, accessKeySecret: string): string {
  return CryptoJS.HmacSHA1(stringToSign, accessKeySecret).toString(CryptoJS.enc.Base64);
}

async function uploadBufferToAliyunOssPublicRead(params: {
  context: UploadCapableFieldContext;
  objectKey: string;
  contentType: string;
  file: Buffer;
}): Promise<string> {
  const { context, objectKey, contentType, file } = params;
  const encodedObjectKey = encodeOssObjectKey(objectKey);
  const objectUrl = `https://${OSS_DOMAIN}/${encodedObjectKey}`;
  const date = new Date().toUTCString();
  const canonicalResource = `/${OSS_BUCKET}/${objectKey}`;
  const canonicalizedHeaders = 'x-oss-object-acl:public-read\n';
  const stringToSign = `PUT\n\n${contentType}\n${date}\n${canonicalizedHeaders}${canonicalResource}`;
  const signature = signOssV1Base64(stringToSign, OSS_ACCESS_KEY_SECRET);

  const putRes = await context.fetch(objectUrl, {
    method: 'PUT',
    headers: {
      Date: date,
      'Content-Type': contentType,
      'x-oss-object-acl': 'public-read',
      Authorization: `OSS ${OSS_ACCESS_KEY_ID}:${signature}`
    },
    body: file
  });

  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`OSS 上传失败 (${putRes.status}): ${body.slice(0, 400)}`);
  }

  return objectUrl;
}

function generateOssSignedGetUrl(params: { objectKey: string; expiresSeconds: number }): string {
  const { objectKey, expiresSeconds } = params;
  const encodedObjectKey = encodeOssObjectKey(objectKey);
  const objectUrl = `https://${OSS_DOMAIN}/${encodedObjectKey}`;
  const expires = Math.floor(Date.now() / 1000) + Math.max(60, expiresSeconds);
  const canonicalResource = `/${OSS_BUCKET}/${objectKey}`;
  const stringToSign = `GET\n\n\n${expires}\n${canonicalResource}`;
  const signature = signOssV1Base64(stringToSign, OSS_ACCESS_KEY_SECRET);
  return (
    `${objectUrl}?OSSAccessKeyId=${encodeURIComponent(OSS_ACCESS_KEY_ID)}` +
    `&Expires=${expires}` +
    `&Signature=${encodeURIComponent(signature)}`
  );
}

async function uploadBufferToAliyunOssPrivateAndGetSignedUrl(params: {
  context: UploadCapableFieldContext;
  objectKey: string;
  contentType: string;
  file: Buffer;
  expiresSeconds: number;
}): Promise<string> {
  const { context, objectKey, contentType, file, expiresSeconds } = params;
  const encodedObjectKey = encodeOssObjectKey(objectKey);
  const objectUrl = `https://${OSS_DOMAIN}/${encodedObjectKey}`;
  const date = new Date().toUTCString();
  const canonicalResource = `/${OSS_BUCKET}/${objectKey}`;
  const stringToSign = `PUT\n\n${contentType}\n${date}\n${canonicalResource}`;
  const signature = signOssV1Base64(stringToSign, OSS_ACCESS_KEY_SECRET);

  const putRes = await context.fetch(objectUrl, {
    method: 'PUT',
    headers: {
      Date: date,
      'Content-Type': contentType,
      Authorization: `OSS ${OSS_ACCESS_KEY_ID}:${signature}`
    },
    body: file
  });

  if (!putRes.ok) {
    const body = await putRes.text();
    throw new Error(`OSS 上传参考图失败 (${putRes.status}): ${body.slice(0, 400)}`);
  }

  return generateOssSignedGetUrl({ objectKey, expiresSeconds });
}

function parseOptionalJsonObjectInput(
  raw: string,
  fieldName: string
): { value?: Record<string, any>; error?: string } {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      return { error: `${fieldName} 必须是 JSON 对象。` };
    }
    return { value: parsed };
  } catch (error) {
    return { error: `${fieldName} 不是有效 JSON: ${toErrorMessage(error)}` };
  }
}

basekit.addField({
  formItems: [
    {
      key: 'model',
      label: '图像模型',
      component: FieldComponent.SingleSelect,
      validator: { required: true },
      tooltips: [
        {
          type: 'text',
          content: '默认推荐 Nano Banana Pro。若选择“自定义模型”，请在下一项填写模型 ID。'
        }
      ],
      defaultValue: { label: 'Nano Banana Pro（google/gemini-3-pro-image-preview）', value: DEFAULT_MODEL },
      props: {
        options: [
          { label: 'Nano Banana Pro（google/gemini-3-pro-image-preview）', value: DEFAULT_MODEL },
          { label: '自定义模型', value: 'custom' }
        ],
        placeholder: '选择模型'
      }
    },
    {
      key: 'model_custom',
      label: '自定义模型ID（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '仅当上方选择“自定义模型”时生效。格式一般为 provider/model-name。'
        },
        { type: 'link', text: '查看可用模型列表', link: 'https://openrouter.ai/models' }
      ],
      props: {
        placeholder: '例如：google/gemini-3-pro-image-preview'
      }
    },
    {
      key: 'prompt',
      label: '主提示词',
      component: FieldComponent.Input,
      validator: { required: true },
      tooltips: [
        {
          type: 'text',
          content: '描述你希望生成什么图。越具体，生成结果通常越稳定。'
        }
      ],
      props: {
        placeholder: '例如：一张电影感的人像，柔和晨光，写实风格'
      }
    },
    {
      key: 'negative_prompt',
      label: '负向提示词（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '用于告诉模型不要出现什么元素，如“不要水印、不要模糊、不要文字”。'
        }
      ],
      props: {
        placeholder: '例如：no text, no watermark, no blur'
      }
    },
    {
      key: 'reference_image_field',
      label: '参考图来源字段（可选）',
      component: FieldComponent.FieldSelect,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '可直接选择附件字段、链接字段或文本字段。系统会自动提取图片链接（附件优先取 tmp_url）。'
        }
      ],
      props: {
        placeholder: '选择包含参考图链接的字段（附件/链接/文本）',
        supportType: [FieldType.Attachment, FieldType.Url, FieldType.Text]
      }
    },
    {
      key: 'api_key',
      label: 'OpenRouter API密钥',
      component: FieldComponent.Input,
      validator: { required: true },
      tooltips: [
        {
          type: 'text',
          content: '你的 OpenRouter 临时或正式密钥。仅用于当前字段执行请求。'
        },
        { type: 'link', text: '获取 API Key', link: 'https://openrouter.ai/settings/keys' }
      ],
      props: {
        placeholder: 'sk-or-v1-...'
      }
    },
    {
      key: 'with_text',
      label: '返回文字说明（可选）',
      component: FieldComponent.Radio,
      validator: { required: false },
      defaultValue: { label: '否', value: 'off' },
      tooltips: [
        {
          type: 'text',
          content: '开启后模型会尽量同时返回图像和文字说明，可能增加文本 token 消耗。'
        }
      ],
      props: {
        options: [
          { label: '否（仅图像）', value: 'off' },
          { label: '是（图像+文本）', value: 'on' }
        ]
      }
    },
    {
      key: 'image_aspect_ratio',
      label: '画面比例（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '对应 image_config.aspect_ratio。常见：1:1、4:3、16:9、9:16。'
        }
      ],
      props: {
        placeholder: '例如：1:1、16:9'
      }
    },
    {
      key: 'image_size',
      label: '图片分辨率档位（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '对应 image_config.image_size。常见：1K、2K、4K（取决于模型支持）。'
        }
      ],
      props: {
        placeholder: '例如：1K、2K、4K'
      }
    },
    {
      key: 'temperature',
      label: '采样温度（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '控制随机性。常见范围 0~2；越低越稳定，越高越有创意。'
        }
      ],
      props: {
        placeholder: '例如：0.7'
      }
    },
    {
      key: 'top_p',
      label: '核采样Top P（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '与温度类似用于控制采样范围。常见 0~1；越低越保守。'
        }
      ],
      props: {
        placeholder: '例如：0.9'
      }
    },
    {
      key: 'seed',
      label: '随机种子（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '固定随机种子有助于复现实验结果。相同参数+相同 seed 更接近同一风格。'
        }
      ],
      props: {
        placeholder: '例如：42'
      }
    },
    {
      key: 'max_tokens',
      label: '最大输出Token（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '限制文本输出长度。仅对文本部分生效，不直接限制图片分辨率。'
        }
      ],
      props: {
        placeholder: '例如：1024'
      }
    },
    {
      key: 'stop_sequences',
      label: '停止序列（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '当模型输出命中这些内容时提前停止。多个值可用英文逗号、中文逗号或换行分隔。'
        }
      ],
      props: {
        placeholder: '例如：END, ###'
      }
    },
    {
      key: 'request_url',
      label: '请求地址（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      defaultValue: DEFAULT_URL,
      tooltips: [
        {
          type: 'text',
          content: '一般保持默认即可。只有在你需要代理或特殊路由时再修改。'
        },
        { type: 'link', text: '模型接口文档', link: 'https://openrouter.ai/google/gemini-3-pro-image-preview/api' }
      ],
      props: {
        placeholder: DEFAULT_URL
      }
    },
    {
      key: 'include_reasoning',
      label: '返回推理信息（可选）',
      component: FieldComponent.Radio,
      validator: { required: false },
      defaultValue: { label: '关闭', value: 'off' },
      tooltips: [
        {
          type: 'text',
          content: '若模型支持，可返回推理相关信息。开启后响应体可能更大。'
        }
      ],
      props: {
        options: [
          { label: '关闭', value: 'off' },
          { label: '开启', value: 'on' }
        ]
      }
    },
    {
      key: 'reasoning_json',
      label: '推理配置JSON（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '高级推理参数，需填 JSON 对象。示例：{"effort":"high"}。'
        }
      ],
      props: {
        placeholder: '例如：{"effort":"high"}'
      }
    },
    {
      key: 'response_format_json',
      label: '响应格式JSON（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '用于约束文本响应格式，需填 JSON 对象。'
        }
      ],
      props: {
        placeholder: '例如：{"type":"json_object"}'
      }
    },
    {
      key: 'structured_outputs_json',
      label: '结构化输出JSON（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '用于传入结构化输出配置，需填 JSON 对象（如 schema 约束）。'
        }
      ],
      props: {
        placeholder: '例如：{"schema":{...}}'
      }
    },
    {
      key: 'extra_body_json',
      label: '额外请求参数 JSON（可选）',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        {
          type: 'text',
          content: '透传其他 OpenRouter 参数，需填 JSON 对象。不会覆盖核心字段（model/messages/modalities/stream）。'
        }
      ],
      props: {
        placeholder: '例如：{"top_k":40}'
      }
    }
  ],
  resultType: {
    type: FieldType.Attachment
  },
  execute: async (formItemParams: any, context: UploadCapableFieldContext) => {
    const logID = context?.logID || 'no-log-id';

    const selectedModel = getSelectValue(formItemParams.model);
    const customModel = getText(formItemParams.model_custom);
    const finalModel = selectedModel === 'custom' ? customModel : selectedModel || DEFAULT_MODEL;

    const prompt = getText(formItemParams.prompt);
    const negativePrompt = getText(formItemParams.negative_prompt);
    const referenceImageFieldValue = formItemParams.reference_image_field;
    const withText = getSelectValue(formItemParams.with_text) === 'on';
    const apiKey = getText(formItemParams.api_key);

    const requestUrl = getText(formItemParams.request_url) || DEFAULT_URL;
    const temperature = toOptionalNumber(formItemParams.temperature);
    const maxTokens = toOptionalInteger(formItemParams.max_tokens);
    const seed = toOptionalInteger(formItemParams.seed);
    const topP = toOptionalNumber(formItemParams.top_p);
    const stopSequences = splitDelimitedValues(getText(formItemParams.stop_sequences));
    const includeReasoning = getSelectValue(formItemParams.include_reasoning) === 'on';

    const reasoningJson = parseOptionalJsonObjectInput(getText(formItemParams.reasoning_json), 'reasoning_json');
    if (reasoningJson.error) {
      return { code: FieldCode.ConfigError, msg: reasoningJson.error };
    }

    const responseFormatJson = parseOptionalJsonObjectInput(
      getText(formItemParams.response_format_json),
      'response_format_json'
    );
    if (responseFormatJson.error) {
      return { code: FieldCode.ConfigError, msg: responseFormatJson.error };
    }

    const structuredOutputsJson = parseOptionalJsonObjectInput(
      getText(formItemParams.structured_outputs_json),
      'structured_outputs_json'
    );
    if (structuredOutputsJson.error) {
      return { code: FieldCode.ConfigError, msg: structuredOutputsJson.error };
    }

    const extraBodyJson = parseOptionalJsonObjectInput(getText(formItemParams.extra_body_json), 'extra_body_json');
    if (extraBodyJson.error) {
      return { code: FieldCode.ConfigError, msg: extraBodyJson.error };
    }

    const imageAspectRatio = getText(formItemParams.image_aspect_ratio);
    const imageSize = getText(formItemParams.image_size);

    const mergedReferenceImageUrls = extractReferenceImageUrlsFromFieldValue(referenceImageFieldValue);

    const invalidReferenceImageUrls = mergedReferenceImageUrls.filter(
      (url) => !isSupportedReferenceUrl(url)
    );
    if (invalidReferenceImageUrls.length > 0) {
      return {
        code: FieldCode.ConfigError,
        msg: `参考图链接格式无效：${invalidReferenceImageUrls.slice(0, 3).join(' , ')}`
      };
    }
    const referenceImageUrls = mergedReferenceImageUrls.slice(0, MAX_REFERENCE_IMAGE_INPUTS);

    console.log(`[${logID}] [step-1] parse-input`, {
      model: finalModel,
      requestUrl,
      withText,
      referenceImageFromFieldCount: mergedReferenceImageUrls.length,
      referenceImageCount: referenceImageUrls.length,
      hasApiKey: Boolean(apiKey),
      hasPrompt: Boolean(prompt)
    });

    if (!finalModel) {
      return {
        code: FieldCode.ConfigError,
        msg: '模型不能为空，请选择或填写模型 ID。'
      };
    }

    if (!prompt) {
      return {
        code: FieldCode.ConfigError,
        msg: '图像提示词不能为空。'
      };
    }

    if (!apiKey) {
      return {
        code: FieldCode.ConfigError,
        msg: '请填写 OpenRouter API Key。'
      };
    }

    try {
      const modalities = withText ? ['text', 'image'] : ['image'];
      const userPrompt = negativePrompt
        ? `${prompt}\n\nNegative prompt: ${negativePrompt}`
        : prompt;

      const contentWithImages: Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }> =
        [{ type: 'text', text: userPrompt }];
      for (const imageUrl of referenceImageUrls) {
        contentWithImages.push({
          type: 'image_url',
          image_url: { url: imageUrl }
        });
      }

      const userContent: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }> =
        contentWithImages.length > 1 ? contentWithImages : userPrompt;

      const requestBody: Record<string, any> = {
        model: finalModel,
        messages: [{ role: 'user', content: userContent }],
        modalities,
        stream: false
      };

      if (temperature !== undefined) {
        requestBody.temperature = temperature;
      }
      if (maxTokens !== undefined) {
        requestBody.max_tokens = maxTokens;
      }
      if (seed !== undefined) {
        requestBody.seed = seed;
      }
      if (topP !== undefined) {
        requestBody.top_p = topP;
      }
      if (stopSequences.length > 0) {
        requestBody.stop = stopSequences;
      }
      if (includeReasoning) {
        requestBody.include_reasoning = true;
      }
      if (reasoningJson.value) {
        requestBody.reasoning = reasoningJson.value;
      }
      if (responseFormatJson.value) {
        requestBody.response_format = responseFormatJson.value;
      }
      if (structuredOutputsJson.value) {
        requestBody.structured_outputs = structuredOutputsJson.value;
      }

      const imageConfig: Record<string, any> = {};
      if (imageAspectRatio) {
        imageConfig.aspect_ratio = imageAspectRatio;
      }
      if (imageSize) {
        imageConfig.image_size = imageSize;
      }
      if (Object.keys(imageConfig).length > 0) {
        requestBody.image_config = imageConfig;
      }

      if (extraBodyJson.value) {
        const reservedKeys = new Set(['model', 'messages', 'modalities', 'stream']);
        for (const [key, value] of Object.entries(extraBodyJson.value)) {
          if (reservedKeys.has(key)) {
            continue;
          }
          requestBody[key] = value;
        }
      }

      console.log(`[${logID}] [step-2] request-openrouter`, {
        model: finalModel,
        modalities,
        referenceImageCount: referenceImageUrls.length,
        hasTemperature: temperature !== undefined,
        hasMaxTokens: maxTokens !== undefined,
        hasSeed: seed !== undefined,
        hasTopP: topP !== undefined,
        hasImageConfig: Boolean(requestBody.image_config)
      });

      const response = await context.fetch(requestUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://feishu.cn',
          'X-Title': 'Bitable OpenRouter Image Shortcut'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[${logID}] [step-3] openrouter-error`, {
          status: response.status,
          body: errorText
        });

        if (response.status === 401) {
          return { code: FieldCode.AuthorizationError, msg: 'API Key 无效或已过期。' };
        }
        if (response.status === 402) {
          return { code: FieldCode.QuotaExhausted, msg: 'OpenRouter 余额不足。' };
        }
        if (response.status === 429) {
          return { code: FieldCode.RateLimit, msg: '请求频率过高，请稍后重试。' };
        }

        return {
          code: FieldCode.Error,
          msg: `OpenRouter 请求失败 (${response.status}): ${errorText}`
        };
      }

      const payload = await response.json();
      const choice = payload?.choices?.[0] || {};
      const message = choice?.message || {};

      const imageUrls = parseImageUrls(message);
      const textOutput = parseMessageText(message);

      console.log(`[${logID}] [step-3] response-parsed`, {
        modelUsed: payload?.model || finalModel,
        imageCount: imageUrls.length,
        hasTextOutput: Boolean(textOutput)
      });

      if (imageUrls.length === 0) {
        return {
          code: FieldCode.Error,
          msg: `模型响应中未找到图片字段。文本输出片段: ${textOutput.slice(0, 120)}`
        };
      }

      const httpAttachments: Array<{ name: string; content: string; contentType: 'attachment/url' }> = [];
      const ossUploadCandidates: Array<{ name: string; mimeType: string; file: Buffer }> = [];
      const ossUploadErrors: string[] = [];
      let dataUrlImageCount = 0;
      let oversizedImageCount = 0;

      for (let i = 0; i < imageUrls.length; i += 1) {
        const imageUrl = imageUrls[i];
        const imageIndex = i + 1;

        if (/^https?:\/\//i.test(imageUrl)) {
          httpAttachments.push({
            name: `openrouter-image-${Date.now()}-${imageIndex}.png`,
            content: imageUrl,
            contentType: 'attachment/url'
          });
          continue;
        }

        const dataUrl = parseDataUrl(imageUrl);
        if (dataUrl) {
          dataUrlImageCount += 1;
          const fileName = `openrouter-image-${Date.now()}-${imageIndex}.${inferExt(dataUrl.mimeType)}`;

          try {
            const fileBuffer = Buffer.from(dataUrl.base64, 'base64');
            if (fileBuffer.length > MAX_ATTACHMENT_SIZE_BYTES) {
              oversizedImageCount += 1;
              ossUploadErrors.push(`第 ${imageIndex} 张图片超过 10MB，无法写入附件字段`);
              continue;
            }
            ossUploadCandidates.push({
              name: fileName,
              mimeType: dataUrl.mimeType,
              file: fileBuffer
            });
          } catch (decodeErr) {
            console.error(`[${logID}] [step-4] data-url-decode-failed`, {
              imageIndex,
              error: toErrorMessage(decodeErr)
            });
          }
        }
      }

      const ossUrlAttachments: Array<{ name: string; content: string; contentType: 'attachment/url' }> = [];
      for (let i = 0; i < ossUploadCandidates.length; i += 1) {
        const candidate = ossUploadCandidates[i];
        const objectKey =
          `${OSS_OBJECT_PREFIX}/${new Date().toISOString().slice(0, 10)}/` +
          `${Date.now()}-${i + 1}-${Math.random().toString(36).slice(2, 10)}.${inferExt(candidate.mimeType)}`;
        try {
          const objectUrl = await uploadBufferToAliyunOssPublicRead({
            context,
            objectKey,
            contentType: candidate.mimeType,
            file: candidate.file
          });
          ossUrlAttachments.push({
            name: candidate.name,
            content: objectUrl,
            contentType: 'attachment/url'
          });
        } catch (uploadError) {
          const errorText = toErrorMessage(uploadError);
          ossUploadErrors.push(errorText);
          console.error(`[${logID}] [step-4] upload-oss-failed`, {
            objectKey,
            error: errorText
          });
        }
      }

      const allAttachments = [...httpAttachments, ...ossUrlAttachments];
      const finalAttachments = allAttachments.slice(0, MAX_ATTACHMENT_OUTPUTS);
      const droppedAttachments = Math.max(0, allAttachments.length - finalAttachments.length);

      console.log(`[${logID}] [step-5] return-attachments`, {
        httpAttachments: httpAttachments.length,
        ossUrlAttachments: ossUrlAttachments.length,
        ossUploadErrorCount: ossUploadErrors.length,
        dataUrlImageCount,
        oversizedImageCount,
        droppedAttachments,
        total: finalAttachments.length
      });

      if (finalAttachments.length === 0) {
        if (dataUrlImageCount > 0) {
          const firstError = ossUploadErrors[0] || '未知上传错误';
          return {
            code: FieldCode.Error,
            msg: `模型返回的是 base64 图片，但 OSS 中转失败：${firstError}`
          };
        }
        return {
          code: FieldCode.Error,
          msg: '已解析到图片响应，但无法转换为可写入附件。请检查日志与租户上传权限。'
        };
      }

      return {
        code: FieldCode.Success,
        data: finalAttachments
      };
    } catch (error) {
      console.error(`[${logID}] [step-err] execute-failed`, {
        error: toErrorMessage(error)
      });
      return {
        code: FieldCode.Error,
        msg: `执行失败: ${toErrorMessage(error)}`
      };
    }
  }
});

export default basekit;
