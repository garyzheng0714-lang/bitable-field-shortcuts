import { basekit, FieldType, field, FieldComponent, FieldCode, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
import FormData from 'form-data';
const { t } = field;

// 添加火山引擎域名白名单
basekit.addDomainList([
  'ark.cn-beijing.volces.com',
  'open.feishu.cn',
  'open.larksuite.com',
  'internal-api-drive-stream.feishu.cn',
  'internal-api-drive-stream.larksuite.com',
  'img.alicdn.com',
  'img30.360buyimg.com',
  'thumbnail.coupangcdn.com',
  'images-eu.ssl-images-amazon.com',
  'product-files.pupumall.com',
  'sam-material-online-1302115363.file.myqcloud.com',
  'img.pddpic.com',
  'img.youpin.mi-img.com',
  'pub.ddimg.mobi',
  'p1.meituan.net',
  'f.nooncdn.com',
  'rukminim2.flixcart.com',
  'ir.ozone.ru',
  'basket-06.wbcontent.net',
  'img06.weeecdn.com',
  'cdn.yamibuy.net',
  'http2.mlstatic.com',
  'i.imgur.com',
  'imgur.com',
  'i.ibb.co',
  'ibb.co',
  'i.postimg.cc',
  'postimg.cc',
  'raw.githubusercontent.com',
  'user-images.githubusercontent.com',
  'images.unsplash.com',
  'images.pexels.com',
  'i.pinimg.com',
  'pbs.twimg.com',
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'i.redd.it',
  'preview.redd.it',
  'external-preview.redd.it',
  'cdn.discordapp.com',
  'media.discordapp.net',
]);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'modelType': '模型选择',
        'customModel': '自定义模型名称',
        'apiKey': '自定义Key',
        'prefixCacheId': '前缀缓存ID',
        'prompt': '输入指令',
        'images': '图片内容',
        'webSearch': '联网搜索',
        'thinkingMode': '深度思考',
        'thinking_auto': 'AI 自动判断',
        'thinking_enable': '进行深度思考',
        'thinking_disable': '不进行深度思考',
        'open': '开启',
        'close': '关闭',
        'result': '输出结果',
        'thinking': '思考过程',
        'usage': 'Tokens 数量',
        'cost': '模型费用(¥)',
        'help_apikey': '获取 Key',
        'help_customKey': '非必填；默认已内置 Key。若捷径无法使用，可填写你自己的 Key 进行尝试',
        'help_modelType': '选择预置模型；如需使用其他模型，请选择“自定义模型”并填写下方名称',
        'help_webSearch_pricing': '查看计费规则',
        'help_prefixCacheId': '非必填；填入方舟 Responses API 的 response.id（如 resp_...），用于复用已创建的前缀缓存',
      },
      'en-US': {
        'modelType': 'Model Selection',
        'customModel': 'Custom Model Name',
        'apiKey': 'Custom Key',
        'prefixCacheId': 'Prefix Cache ID',
        'prompt': 'Instruction',
        'images': 'Images',
        'webSearch': 'Web Search',
        'thinkingMode': 'Deep Thinking',
        'thinking_auto': 'Auto',
        'thinking_enable': 'Enabled',
        'thinking_disable': 'Disabled',
        'open': 'On',
        'close': 'Off',
        'result': 'Result',
        'thinking': 'Thinking Process',
        'usage': 'Tokens Usage',
        'cost': 'Model Cost (¥)',
        'help_apikey': 'Get Key',
        'help_customKey': 'Optional. A default key is built-in. If it does not work, try your own key.',
        'help_modelType': 'Choose a preset model. To use another model, select “Custom Model” and fill in the name below.',
        'help_webSearch_pricing': 'Pricing rules',
        'help_prefixCacheId': 'Optional. Paste the Responses API response.id (e.g. resp_...) to reuse an existing prefix cache.',
      },
      'ja-JP': {
        'modelType': 'モデル選択',
        'customModel': 'カスタムモデル名',
        'apiKey': 'カスタムキー',
        'prefixCacheId': 'プレフィックスキャッシュID',
        'prompt': '入力指示',
        'images': '画像コンテンツ',
        'webSearch': 'Web検索',
        'thinkingMode': '深い思考',
        'thinking_auto': '自動',
        'thinking_enable': '有効',
        'thinking_disable': '無効',
        'open': 'オン',
        'close': 'オフ',
        'result': '出力結果',
        'thinking': '思考プロセス',
        'usage': 'トークン数',
        'cost': 'モデル費用(¥)',
        'help_apikey': 'キーを取得',
        'help_customKey': '任意。デフォルトのキーは内蔵されています。動作しない場合は、ご自身のキーを入力してお試しください。',
        'help_modelType': 'プリセットモデルを選択します。その他のモデルを使う場合は「カスタムモデル」を選び、下の名称を入力してください。',
        'help_webSearch_pricing': '料金ルールを見る',
        'help_prefixCacheId': '任意。Responses API の response.id（例：resp_...）を入力すると、作成済みの前置きキャッシュを再利用できます。',
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'modelType',
      label: t('modelType'),
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: 'doubao-seed-1-8-251228', value: 'doubao-seed-1-8-251228' },
          { label: 'doubao-seed-1-6-251015', value: 'doubao-seed-1-6-251015' },
          { label: 'doubao-seed-1-6-flash-250828', value: 'doubao-seed-1-6-flash-250828' },
          { label: 'doubao-seed-1-6-lite-251015', value: 'doubao-seed-1-6-lite-251015' },
          { label: 'doubao-seed-1-6-thinking-250715', value: 'doubao-seed-1-6-thinking-250715' },
          { label: '自定义模型', value: 'custom' },
        ],
      },
      tooltips: [
        {
          type: 'text',
          content: t('help_modelType'),
        },
      ],
      validator: {
        required: true,
      }
    },
    {
      key: 'customModel',
      label: t('customModel'),
      component: FieldComponent.Input,
      props: {
        placeholder: '非必填，仅当选择“自定义模型”选项时生效',
      },
    },
    {
      key: 'prompt',
      label: t('prompt'),
      component: FieldComponent.Input,
      props: {
        placeholder: '',
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'images',
      label: t('images'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text, FieldType.Url, FieldType.Attachment],
      },
    },
    {
      key: 'thinkingMode',
      label: t('thinkingMode'),
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: t('thinking_auto'), value: 'auto' },
          { label: t('thinking_enable'), value: 'enable' },
          { label: t('thinking_disable'), value: 'disable' },
        ],
      },
      defaultValue: 'auto',
      validator: {
        required: true,
      }
    },
    {
      key: 'webSearch',
      label: t('webSearch'),
      component: FieldComponent.Radio,
      props: {
        options: [
          { label: t('close'), value: 'false' },
          { label: t('open'), value: 'true' },
        ],
      },
      tooltips: [
        {
          type: 'link',
          text: t('help_webSearch_pricing'),
          link: 'https://www.volcengine.com/docs/82379/1338550?lang=zh',
        },
      ],
      defaultValue: 'false',
      validator: {
        required: true,
      }
    },
    {
      key: 'apiKey',
      label: t('apiKey'),
      component: FieldComponent.Input,
      props: {
        placeholder: '非必填；留空则使用默认 Key',
      },
      tooltips: [
        {
          type: 'text',
          content: t('help_customKey'),
        },
        {
          type: 'link',
          text: t('help_apikey'),
          link: 'https://www.volcengine.com/docs/82379/1399008?lang=zh'
        }
      ],
    },
    {
      key: 'prefixCacheId',
      label: t('prefixCacheId'),
      component: FieldComponent.Input,
      props: {
        placeholder: '非必填；填入 resp_... 用于复用前缀缓存',
      },
      tooltips: [
        {
          type: 'text',
          content: t('help_prefixCacheId'),
        },
      ],
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'groupKey',
          type: FieldType.Text,
          label: 'id',
          isGroupByKey: true,
          hidden: true,
        },
        {
          key: 'result',
          type: FieldType.Text,
          label: t('result'),
          primary: true,
        },
        {
          key: 'thinking',
          type: FieldType.Text,
          label: t('thinking'),
        },
        {
          key: 'usage',
          type: FieldType.Text,
          label: t('usage'),
        },
        {
          key: 'cost',
          type: FieldType.Number,
          label: t('cost'),
          extra: {
            formatter: '0.0000000' as any,
          },
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数
  execute: async (formItemParams: any, context) => {
    const { modelType, customModel, apiKey, prefixCacheId, prompt, images, webSearch, thinkingMode } = formItemParams;
    const normalizeValue = (val: any) => {
      if (val && typeof val === 'object' && 'value' in val) return (val as any).value;
      return val;
    };
    const normalizedModelType = normalizeValue(modelType);
    const normalizedCustomModel = normalizeValue(customModel);
    const normalizedPrefixCacheId = String(normalizeValue(prefixCacheId) ?? '').trim();
    const normalizedWebSearch = normalizeValue(webSearch);
    const normalizedThinkingMode = normalizeValue(thinkingMode);
    const normalizedPrompt = normalizeValue(prompt);
    const DEFAULT_KEY = '42613b83-f46c-468f-98b1-2036c8dc5a68';
    const normalizedApiKey = String(normalizeValue(apiKey) ?? '').trim();
    const effectiveApiKey = normalizedApiKey || DEFAULT_KEY;

    // 日志记录函数
    function debugLog(arg: any, showContext = false) {
      if (!showContext) {
        // @ts-ignore
        console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
        return;
      }
      const safeFormItemParams = {
        ...formItemParams,
        apiKey: apiKey ? '***' : apiKey,
      };
      const safeContext = {
        logID: (context as any)?.logID,
        timeZone: (context as any)?.timeZone,
        tenantKey: (context as any)?.tenantKey,
        baseID: (context as any)?.baseID,
        tableID: (context as any)?.tableID,
        recordID: (context as any)?.recordID,
        packID: (context as any)?.packID,
        extensionID: (context as any)?.extensionID,
      };
      console.log(JSON.stringify({
        formItemParams: safeFormItemParams,
        context: safeContext,
        arg
      }), '\n');
    }

    debugLog('=====start=====v2.1', true);

    // 封装 fetch 函数
    const fetch: <T = Object>(...arg: Parameters<typeof context.fetch>) => Promise<
      | {
          ok: boolean;
          status: number;
          contentType?: string;
          text: string;
          json?: T;
        }
      | { code: number; error: any; [p: string]: any }
    > = async (url, init, authId) => {
      try {
        const res = await context.fetch(url, init, authId);
        const resText = await res.text();
        let json: any = undefined;
        try {
          json = JSON.parse(resText);
        } catch {
          json = undefined;
        }
        const contentType = (res.headers as any)?.get?.('content-type') || undefined;
        const headers = init?.headers ? { ...(init.headers as any) } : init?.headers;
        if (headers && typeof headers === 'object') {
          for (const k of Object.keys(headers)) {
            if (String(k).toLowerCase() === 'authorization') {
              headers[k] = headers[k] ? 'Bearer ***' : headers[k];
            }
          }
        }
        const safeInit = {
          ...init,
          headers,
        };
        debugLog({
          [`===fetch res： ${url}`]: {
            url,
            init: safeInit,
            status: (res as any)?.status,
            contentType,
            resText: resText.slice(0, 4000), // 截取日志
          }
        });
        return {
          ok: Boolean((res as any)?.ok),
          status: Number((res as any)?.status ?? 0),
          contentType,
          text: resText,
          json,
        } as any;
      } catch (e) {
        const headers = init?.headers ? { ...(init.headers as any) } : init?.headers;
        if (headers && typeof headers === 'object') {
          for (const k of Object.keys(headers)) {
            if (String(k).toLowerCase() === 'authorization') {
              headers[k] = headers[k] ? 'Bearer ***' : headers[k];
            }
          }
        }
        const safeInit = {
          ...init,
          headers,
        };
        debugLog({
          [`===fetch error： ${url}`]: {
            url,
            init: safeInit,
            error: e
          }
        });
        return {
          code: -1,
          error: e
        };
      }
    };

    try {
      // 1. 处理图片输入
      const imageInputItems: any[] = [];
      const appendImageUrl = (url: string) => {
        const clean = String(url ?? '').trim();
        if (/^https?:\/\//i.test(clean)) {
          imageInputItems.push({ type: 'input_image', image_url: clean } as any);
        }
      };
      const appendUrlsFromText = (text: string) => {
        String(text ?? '')
          .split(/[,，\n]/)
          .map(s => s.trim())
          .filter(Boolean)
          .forEach(appendImageUrl);
      };
      const extractUrlsFromUnknown = (val: any) => {
        if (typeof val === 'string') {
          appendUrlsFromText(val);
          return;
        }
        if (val && typeof val === 'object') {
          const candidates = [
            (val as any).tmp_url,
            (val as any).tmpUrl,
            (val as any).download_url,
            (val as any).downloadUrl,
            (val as any).preview_url,
            (val as any).previewUrl,
            (val as any).link,
            (val as any).url,
            (val as any).text,
          ];
          candidates.forEach(candidate => {
            if (typeof candidate === 'string') appendUrlsFromText(candidate);
          });
        }
      };
      const extractUrlsFromExtra = (extra: any) => {
        let raw: any = extra;
        if (typeof raw === 'string') {
          try {
            raw = JSON.parse(raw);
          } catch {
            raw = extra;
          }
        }
        if (typeof raw === 'string') {
          appendUrlsFromText(raw);
          return;
        }
        if (raw && typeof raw === 'object') {
          const keys = ['url', 'link', 'tmp_url', 'tmpUrl', 'download_url', 'downloadUrl', 'preview_url', 'previewUrl'];
          keys.forEach(k => {
            if (typeof raw[k] === 'string') appendImageUrl(raw[k]);
          });
          if (Array.isArray(raw.urls)) raw.urls.forEach((u: any) => typeof u === 'string' && appendImageUrl(u));
          if (Array.isArray(raw.links)) raw.links.forEach((u: any) => typeof u === 'string' && appendImageUrl(u));
        }
      };
      const getBufferFromRes = async (res: any) => {
        if (typeof res.buffer === 'function') {
          return await res.buffer();
        }
        if (typeof res.arrayBuffer === 'function') {
          const ab = await res.arrayBuffer();
          return Buffer.from(ab);
        }
        return undefined;
      };

      const downloadAttachmentBuffer = async (attachmentToken: string) => {
        const token = String(attachmentToken ?? '').trim();
        if (!token) return undefined;
        const urls = [
          `https://open.feishu.cn/open-apis/drive/v1/medias/${token}/download`,
          `https://open.larksuite.com/open-apis/drive/v1/medias/${token}/download`,
        ];
        for (const url of urls) {
          try {
            const res = await context.fetch(url, { method: 'GET' });
            if (!res.ok) continue;
            const buf = await getBufferFromRes(res);
            if (buf && buf.length > 0) return buf as Buffer;
          } catch {
          }
        }
        return undefined;
      };
      const downloadByUrlBuffer = async (url: string) => {
        const u = String(url ?? '').trim();
        if (!/^https?:\/\//i.test(u)) return { status: 0 } as { status: number; buf?: Buffer; contentType?: string };
        try {
          const referer = (() => {
            try {
              return new URL(u).origin + '/';
            } catch {
              return undefined;
            }
          })();
          const res = await context.fetch(u, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0',
              Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
              ...(referer ? { Referer: referer } : {}),
            } as any,
          });
          if (!res.ok) return { status: res.status };
          const contentType = (res.headers as any)?.get?.('content-type') || undefined;
          const buf = await getBufferFromRes(res);
          if (buf && buf.length > 0) return { status: res.status, buf: buf as Buffer, contentType };
        } catch {
        }
        return { status: 0 };
      };
      const formatArkErrorMessage = (payload: any, status?: number) => {
        const err = payload?.error ?? payload;
        const code = err?.code ?? err?.type;
        const message = err?.message ?? err?.error?.message ?? '';
        const normalized = String([code, message].filter(Boolean).join(': ')).trim();
        const lower = normalized.toLowerCase();
        const isAuth =
          status === 401 ||
          status === 403 ||
          code === 'AuthenticationError' ||
          code === 'Unauthorized' ||
          err?.type === 'Unauthorized' ||
          /unauthorized|forbidden/.test(lower) ||
          (/api key/.test(lower) && /(deleted|disable|disabled|invalid|expired)/.test(lower));
        if (isAuth) {
          return `API Key 无效或已被禁用/删除，请更新 Key 后重试${normalized ? `（${normalized}）` : ''}`;
        }
        return normalized;
      };
      const uploadBufferToArk = async (fileBuffer: Buffer, filename: string, mimeType?: string) => {
        const form = new FormData();
        form.append('purpose', 'user_data');
        form.append('file', fileBuffer, {
          filename: filename || 'image',
          contentType: mimeType || 'application/octet-stream',
        } as any);
        const res = await context.fetch('https://ark.cn-beijing.volces.com/api/v3/files', {
          method: 'POST',
          headers: {
            ...(form as any).getHeaders(),
            Authorization: `Bearer ${effectiveApiKey}`,
          },
          body: form as any,
        });
        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          json = undefined;
        }
        const fileId = json?.id ?? json?.data?.id ?? json?.file?.id;
        if (!res.ok || !fileId) {
          const errMsg = formatArkErrorMessage(json, res.status);
          if (errMsg.startsWith('API Key')) throw new Error(errMsg);
          throw new Error(`上传图片失败：${errMsg || text.slice(0, 2000)}`);
        }
        return String(fileId);
      };

      if (images) {
        if (
          Array.isArray(images) &&
          images.length > 0 &&
          images.some((item: any) => {
            if (!item || typeof item !== 'object') return false;
            if ('attachmentToken' in item) return true;
            if ('tmp_url' in item || 'tmpUrl' in item) return true;
            if ('download_url' in item || 'downloadUrl' in item) return true;
            if ('preview_url' in item || 'previewUrl' in item) return true;
            return false;
          })
        ) {
          const beforeTotal = imageInputItems.length;
          const attachmentImageCount = (images as any[]).filter(item => {
            if (!item || typeof item !== 'object') return false;
            const mimeType = (item as any).mimeType ?? (item as any).type;
            if (mimeType && !String(mimeType).startsWith('image/')) return false;
            return Boolean(
              (item as any).attachmentToken ||
              (item as any).tmp_url ||
              (item as any).tmpUrl ||
              (item as any).download_url ||
              (item as any).downloadUrl ||
              (item as any).preview_url ||
              (item as any).previewUrl
            );
          }).length;
          for (const item of images as any[]) {
            if (imageInputItems.length >= 10) break;
            if (!item || typeof item !== 'object') continue;
            const mimeType = (item as any).mimeType ?? (item as any).type;
            if (mimeType && !String(mimeType).startsWith('image/')) continue;

            const directUrl =
              (item as any).tmp_url ||
              (item as any).tmpUrl ||
              (item as any).download_url ||
              (item as any).downloadUrl ||
              (item as any).preview_url ||
              (item as any).previewUrl ||
              (item as any).url ||
              (item as any).link;
            if (directUrl) {
              const { buf } = await downloadByUrlBuffer(String(directUrl));
              if (buf) {
                const fileId = await uploadBufferToArk(buf, String((item as any).name ?? 'image'), mimeType);
                imageInputItems.push({ type: 'input_image', file_id: fileId } as any);
                continue;
              }
            }

            const beforeCount = imageInputItems.length;
            extractUrlsFromExtra((item as any).extra);
            if (imageInputItems.length >= 10) break;
            if (imageInputItems.length > beforeCount) continue;

            const attachmentToken = (item as any).attachmentToken;
            if (attachmentToken) {
              const buf = await downloadAttachmentBuffer(String(attachmentToken));
              if (!buf) continue;
              const fileId = await uploadBufferToArk(buf, String((item as any).name ?? 'image'), mimeType);
              imageInputItems.push({ type: 'input_image', file_id: fileId } as any);
            }
          }
          if (attachmentImageCount > 0 && imageInputItems.length === beforeTotal) {
            throw new Error('图片附件解析失败：请确认附件为图片且当前有权限下载该附件');
          }
        } else if (Array.isArray(images)) {
          images.forEach(v => extractUrlsFromUnknown(v));
        } else {
          extractUrlsFromUnknown(images);
        }
      }
      const resolveImageInputItems = async (items: any[]) => {
        const resolved: any[] = [];
        const hasImageUrl = items.some(it => it && typeof it === 'object' && typeof it.image_url === 'string');
        const urlItems = items.filter(it => it && typeof it === 'object' && typeof it.image_url === 'string');
        const urlToFilename = (url: string) => {
          try {
            const u = new URL(url);
            const last = u.pathname.split('/').filter(Boolean).pop();
            return last || 'image';
          } catch {
            return 'image';
          }
        };
        for (const it of items) {
          if (resolved.length >= 10) break;
          if (it && typeof it === 'object' && it.file_id) {
            resolved.push(it);
            continue;
          }
          const url = it && typeof it === 'object' ? it.image_url : undefined;
          if (typeof url !== 'string') continue;
          const { buf, contentType } = await downloadByUrlBuffer(url);
          if (!buf) continue;
          const fileId = await uploadBufferToArk(buf, urlToFilename(url), contentType);
          resolved.push({ type: 'input_image', file_id: fileId } as any);
        }
        if (hasImageUrl && resolved.length === 0) {
          const fallback = urlItems.slice(0, 10).map(it => ({ type: 'input_image', image_url: it.image_url } as any));
          if (fallback.length === 0) {
            throw new Error('图片下载失败：请检查图片链接是否可访问');
          }
          return fallback;
        }
        return resolved;
      };
      const resolvedImageItems = await resolveImageInputItems(imageInputItems);

      // 2. 构造 API 请求 Body
      const apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/responses'; // 使用 Responses API
      
      let input: any;
      const shouldUseWebSearch = normalizedWebSearch === 'true' || normalizedWebSearch === true;
      const shouldUseWebSearchTool = shouldUseWebSearch;
      if (resolvedImageItems.length > 0) {
        const content: any[] = [...resolvedImageItems.slice(0, 10)];
        content.push({ type: 'input_text', text: String(normalizedPrompt ?? '') });
        input = [{ role: 'user', content }];
      } else if (shouldUseWebSearchTool) {
        input = [
          {
            role: 'user',
            content: String(normalizedPrompt ?? ''),
          },
        ];
      } else {
        // 纯文本
        input = String(normalizedPrompt ?? '');
      }

      const finalModel = normalizedModelType === 'custom'
        ? String(normalizedCustomModel ?? '').trim()
        : String(normalizedModelType ?? '').trim();

      if (!finalModel) {
        throw new Error('model 不能为空：请选择模型或填写自定义模型名称');
      }

      const requestBody: any = {
        model: finalModel,
        input: input,
      };
      if (normalizedPrefixCacheId) {
        if (!/^resp_/i.test(normalizedPrefixCacheId)) {
          throw new Error('前缀缓存ID格式不正确：应以 resp_ 开头');
        }
        requestBody.previous_response_id = normalizedPrefixCacheId;
        requestBody.caching = { type: 'enabled' };
      }

      // 处理联网搜索
      if (shouldUseWebSearchTool) {
        requestBody.tools = [
          {
            type: 'web_search',
            max_keyword: 2,
          },
        ];
      }

      // 处理深度思考
      if (normalizedThinkingMode === 'enable') {
        requestBody.thinking = { type: 'enabled' };
      } else if (normalizedThinkingMode === 'disable') {
        requestBody.thinking = { type: 'disabled' };
      }
      // 'auto' 模式不传递 thinking 参数，使用默认行为

      const isThinkingMismatchWithCachedHead = (message: string) =>
        /thinking type is not consistent with head cached response/i.test(String(message || ''));

      const doRequest = async (body: any) => {
        const baseHeaders: any = {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `Bearer ${effectiveApiKey}`,
        };
        
        // FaaS 线上环境要求直接传递对象作为 body，由运行时负责 JSON 序列化
        // 如果传递字符串，FaaS 运行时可能会错误地预处理导致请求体格式异常
        // 表现为：err:readObjectStart: expect { or n, but found , error found in #0 byte
        const res: any = await fetch(apiUrl, {
          method: 'POST',
          headers: baseHeaders,
          body: body,
        });

        if (res?.code === -1) {
          throw res?.error || new Error('网络请求失败');
        }

        const payload = res?.json;
        const rawText = String(res?.text ?? '');

        if (!payload) {
          throw new Error(rawText.slice(0, 2000) || `Ark 响应非 JSON：HTTP ${res?.status ?? 0}`);
        }

        if (!res?.ok || payload?.error) {
          const msg = formatArkErrorMessage(payload, res?.status) || rawText.slice(0, 2000) || `请求失败：HTTP ${res?.status ?? 0}`;
          throw new Error(msg);
        }

        return payload;
      };

      const buildBodyWithThinking = (mode: 'enable' | 'disable' | 'omit') => {
        const body: any = { ...requestBody };
        if (mode === 'omit') {
          delete body.thinking;
          return body;
        }
        body.thinking = { type: mode === 'enable' ? 'enabled' : 'disabled' };
        return body;
      };

      const thinkingCandidates: Array<'enable' | 'disable' | 'omit'> =
        normalizedThinkingMode === 'enable'
          ? ['enable', 'disable']
          : normalizedThinkingMode === 'disable'
            ? ['disable', 'enable']
            : ['omit', 'disable', 'enable'];

      // 3. 发起请求（若复用缓存且 thinking 不一致，自动重试对齐）
      let res: any;
      let lastError: unknown;
      for (const mode of thinkingCandidates) {
        try {
          res = await doRequest(buildBodyWithThinking(mode));
          lastError = undefined;
          break;
        } catch (e) {
          lastError = e;
          const msg = e instanceof Error ? e.message : String(e);
          if (normalizedPrefixCacheId && isThinkingMismatchWithCachedHead(msg)) {
            continue;
          }
          throw e;
        }
      }
      if (!res) {
        throw lastError instanceof Error ? lastError : new Error(String(lastError));
      }

      // 4. 解析结果
      // Responses API standard response: { output: [{ message: { content: ... } }], usage: ... }
      
      let resultText = '';
      let thinkingText = '';
      let usageInfo = { input_tokens: 0, output_tokens: 0, cached_tokens: 0 };

      if (res.choices && res.choices.length > 0) {
          // OpenAI compatible format
          resultText = res.choices[0].message.content;
          usageInfo = {
            input_tokens: Number(res?.usage?.input_tokens ?? res?.usage?.prompt_tokens ?? 0),
            output_tokens: Number(res?.usage?.output_tokens ?? res?.usage?.completion_tokens ?? 0),
            cached_tokens: Number(res?.usage?.input_tokens_details?.cached_tokens ?? res?.usage?.prompt_tokens_details?.cached_tokens ?? 0),
          };
      } else if (Array.isArray(res?.output) && res.output.length > 0) {
          const outputs = res.output;
          const messageOutput = outputs.find((o: any) => o?.type === 'message' && o?.role === 'assistant') || outputs.find((o: any) => o?.type === 'message');
          const reasoningOutput = outputs.find((o: any) => o?.type === 'reasoning');

          if (reasoningOutput?.summary && Array.isArray(reasoningOutput.summary)) {
            thinkingText = reasoningOutput.summary.map((s: any) => s?.text || '').join('\n');
          }

          const messageContent = messageOutput?.content ?? messageOutput?.message?.content;
          if (typeof messageContent === 'string') {
            resultText = messageContent;
          } else if (Array.isArray(messageContent)) {
            resultText = messageContent.map((p: any) => p?.text || '').join('');
          }


          usageInfo = {
            input_tokens: Number(res?.usage?.input_tokens ?? 0),
            output_tokens: Number(res?.usage?.output_tokens ?? 0),
            cached_tokens: Number(res?.usage?.input_tokens_details?.cached_tokens ?? 0),
          };
      }

      // 5. 计算费用
      const normalizeModelToPricingKey = (model: string) => {
        const m = String(model || '').trim();
        if (/^doubao-seed-1-8/i.test(m)) return 'doubao-seed-1.8';
        if (/^doubao-seed-1-6-thinking/i.test(m)) return 'doubao-seed-1.6-thinking';
        if (/^doubao-seed-1-6-flash/i.test(m)) return 'doubao-seed-1.6-flash';
        if (/^doubao-seed-1-6-lite/i.test(m)) return 'doubao-seed-1.6-lite';
        if (/^doubao-seed-1-6-vision/i.test(m)) return 'doubao-seed-1.6-vision';
        if (/^doubao-seed-1-6(?!-(thinking|flash|lite|vision))/i.test(m)) return 'doubao-seed-1.6';
        return 'unknown';
      };

      const pickPricingTier = (inputTokens: number) => {
        const t = Number(inputTokens || 0);
        if (t <= 32000) return 0;
        if (t <= 128000) return 1;
        return 2;
      };

      const pricingTable: Record<string, Array<{ input: number; cached_input: number; output: number | { small: number; large: number } }>> = {
        'doubao-seed-1.8': [
          { input: 0.8, cached_input: 0.16, output: { small: 2.0, large: 8.0 } },
          { input: 1.2, cached_input: 0.16, output: 16.0 },
          { input: 2.4, cached_input: 0.16, output: 24.0 },
        ],
        'doubao-seed-1.6': [
          { input: 0.8, cached_input: 0.16, output: { small: 2.0, large: 8.0 } },
          { input: 1.2, cached_input: 0.16, output: 16.0 },
          { input: 2.4, cached_input: 0.16, output: 24.0 },
        ],
        'doubao-seed-1.6-thinking': [
          { input: 0.8, cached_input: 0.16, output: 8.0 },
          { input: 1.2, cached_input: 0.16, output: 16.0 },
          { input: 2.4, cached_input: 0.16, output: 24.0 },
        ],
        'doubao-seed-1.6-lite': [
          { input: 0.3, cached_input: 0.06, output: { small: 0.6, large: 2.4 } },
          { input: 0.6, cached_input: 0.06, output: 4.0 },
          { input: 1.2, cached_input: 0.06, output: 12.0 },
        ],
        'doubao-seed-1.6-flash': [
          { input: 0.15, cached_input: 0.03, output: 1.5 },
          { input: 0.30, cached_input: 0.03, output: 3.0 },
          { input: 0.60, cached_input: 0.03, output: 6.0 },
        ],
        'doubao-seed-1.6-vision': [
          { input: 0.8, cached_input: 0.16, output: 8.0 },
          { input: 1.2, cached_input: 0.16, output: 16.0 },
          { input: 2.4, cached_input: 0.16, output: 24.0 },
        ],
      };

      const cacheStoragePricePerMillionTokenPerHour = 0.017;

      const pricingKey = normalizeModelToPricingKey(finalModel);
      const tierIndex = pickPricingTier(usageInfo.input_tokens);
      const tier = pricingTable[pricingKey]?.[tierIndex] ?? pricingTable['doubao-seed-1.8'][0];

      const cachedTokens = Math.max(0, Math.min(Number(usageInfo.cached_tokens || 0), Number(usageInfo.input_tokens || 0)));
      const uncachedTokens = Math.max(0, Number(usageInfo.input_tokens || 0) - cachedTokens);
      const outputTokens = Math.max(0, Number(usageInfo.output_tokens || 0));
      const outputIsSmall = outputTokens <= 200;
      const outputUnitPrice = typeof tier.output === 'number' ? tier.output : (outputIsSmall ? tier.output.small : tier.output.large);

      const inputCost = (uncachedTokens / 1000000) * tier.input;
      const cachedInputCost = (cachedTokens / 1000000) * tier.cached_input;
      const outputCost = (outputTokens / 1000000) * outputUnitPrice;
      const totalCost = parseFloat((inputCost + cachedInputCost + outputCost).toFixed(10));

      const cachedRate = usageInfo.input_tokens > 0 ? (cachedTokens / usageInfo.input_tokens) : 0;
      const tierText = tierIndex === 0 ? '输入≤32k' : tierIndex === 1 ? '输入(32k,128k]' : '输入(128k,256k]';
      const outText = typeof tier.output === 'number' ? '' : (outputIsSmall ? '，输出≤0.2k' : '，输出>0.2k');
      const pricingText = `${tierText}${outText}；输入单价${tier.input}，缓存输入单价${tier.cached_input}，缓存存储单价${cacheStoragePricePerMillionTokenPerHour}（元/百万token/小时），输出单价${outputUnitPrice}（元/百万token）`;
      const formulaText = `费用=(输入未命中${uncachedTokens}/1e6×${tier.input})+(缓存命中${cachedTokens}/1e6×${tier.cached_input})+(缓存存储token/1e6×${cacheStoragePricePerMillionTokenPerHour}×时长小时)+(输出${outputTokens}/1e6×${outputUnitPrice})`;

      const groupKey = String((context as any)?.recordID || (context as any)?.logID || Date.now());

      return {
        code: FieldCode.Success,
        data: {
          groupKey,
          result: resultText || '未获取到结果，请检查 API Key 和模型名称',
          thinking: thinkingText,
          usage: [
            `输入：${usageInfo.input_tokens} tokens（命中缓存：${cachedTokens}，未命中：${uncachedTokens}，命中率：${(cachedRate * 100).toFixed(2)}%）`,
            `输出：${outputTokens} tokens`,
            `计价：${pricingText}`,
            `计价逻辑：${formulaText}；缓存存储费用未计入（当前响应缺少存储token与时长数据）`,
          ].join('\n'),
          cost: totalCost,
        }
      }

    } catch (e) {
      console.log('====error', String(e));
      debugLog({
        '===999 异常错误': String(e)
      });
      const errMsg = e instanceof Error ? e.message : String(e);
      const groupKey = String((context as any)?.recordID || (context as any)?.logID || Date.now());
      return {
        code: FieldCode.Success,
        data: {
            groupKey,
            result: `Error: ${errMsg}`,
            thinking: '',
            usage: '',
            cost: 0,
        }
      }
    }
  },
});
export default basekit;
