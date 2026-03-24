import { basekit, FieldType, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';

const MODEL_DOC_URL = 'https://help.aliyun.com/zh/model-studio/getting-started/models';
const FIRST_CALL_DOC_URL = 'https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen';
const DEFAULT_REQUEST_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const TUTORIAL_DOC_URL = 'https://www.feishu.cn/docx/I23AdxZPeovazUxCSCAces3Jn3c';

basekit.addDomainList(['dashscope.aliyuncs.com']);

interface PriceTier {
  label: string;
  maxPromptTokens: number | null;
  inputPerMillion: number;
  outputPerMillion: number;
  thinkingOutputPerMillion?: number;
}

interface ModelPriceConfig {
  id: string;
  aliases: string[];
  name: string;
  supportsThinking: boolean;
  tiers: PriceTier[];
}

const MODEL_PRICING: ModelPriceConfig[] = [
  {
    id: 'qwen-max',
    aliases: ['qwen-max-latest'],
    name: '千问 Max',
    supportsThinking: false,
    tiers: [
      { label: '0-32K', maxPromptTokens: 32_000, inputPerMillion: 2.4, outputPerMillion: 9.6 },
      { label: '32K-128K', maxPromptTokens: 128_000, inputPerMillion: 8, outputPerMillion: 32 },
      { label: '>128K', maxPromptTokens: null, inputPerMillion: 40, outputPerMillion: 120 },
    ],
  },
  {
    id: 'qwen-plus',
    aliases: ['qwen-plus-latest'],
    name: '千问 Plus',
    supportsThinking: true,
    tiers: [
      { label: '0-128K', maxPromptTokens: 128_000, inputPerMillion: 0.8, outputPerMillion: 2, thinkingOutputPerMillion: 8 },
      { label: '>128K', maxPromptTokens: null, inputPerMillion: 2, outputPerMillion: 8, thinkingOutputPerMillion: 40 },
    ],
  },
  {
    id: 'qwen-flash',
    aliases: ['qwen-flash-latest'],
    name: '千问 Flash',
    supportsThinking: true,
    tiers: [
      { label: '0-128K', maxPromptTokens: 128_000, inputPerMillion: 0.15, outputPerMillion: 0.6, thinkingOutputPerMillion: 2.4 },
      { label: '>128K', maxPromptTokens: null, inputPerMillion: 0.3, outputPerMillion: 1.2, thinkingOutputPerMillion: 4.8 },
    ],
  },
  {
    id: 'qwen-turbo',
    aliases: ['qwen-turbo-latest'],
    name: '千问 Turbo',
    supportsThinking: true,
    tiers: [
      { label: '0-128K', maxPromptTokens: 128_000, inputPerMillion: 0.3, outputPerMillion: 0.6, thinkingOutputPerMillion: 3 },
      { label: '>128K', maxPromptTokens: null, inputPerMillion: 0.6, outputPerMillion: 1.2, thinkingOutputPerMillion: 6 },
    ],
  },
];

const MODEL_OPTIONS = [
  { label: '千问 Max', value: 'qwen-max' },
  { label: '千问 Plus', value: 'qwen-plus' },
  { label: '千问 Flash', value: 'qwen-flash' },
  { label: '千问 Turbo', value: 'qwen-turbo' },
  { label: '自定义模型', value: 'custom' },
];

const trimString = (input: unknown): string => (typeof input === 'string' ? input.trim() : '');

const parseTokenCount = (input: unknown): number => {
  const value = Number(input);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const normalizeContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        if (item && typeof item === 'object' && typeof (item as any).text === 'string') {
          return (item as any).text;
        }
        return '';
      })
      .join('');
  }
  if (content && typeof content === 'object' && typeof (content as any).text === 'string') {
    return (content as any).text;
  }
  return '';
};

const truncateText = (input: string, maxLength = 300): string => {
  if (input.length <= maxLength) {
    return input;
  }
  return `${input.slice(0, maxLength)}...`;
};

const resolveModelConfig = (modelId: string): ModelPriceConfig | undefined => {
  const normalized = modelId.toLowerCase();
  return MODEL_PRICING.find((item) => {
    if (normalized === item.id) {
      return true;
    }
    if (item.aliases.includes(normalized)) {
      return true;
    }
    if (normalized.startsWith(`${item.id}-`)) {
      return true;
    }
    return item.aliases.some((alias) => normalized.startsWith(`${alias}-`));
  });
};

const selectPriceTier = (tiers: PriceTier[], promptTokens: number): PriceTier => {
  for (const tier of tiers) {
    if (tier.maxPromptTokens === null || promptTokens <= tier.maxPromptTokens) {
      return tier;
    }
  }
  return tiers[tiers.length - 1];
};

basekit.addField({
  formItems: [
    {
      key: 'model',
      label: '模型',
      component: FieldComponent.SingleSelect,
      validator: { required: true },
      tooltips: [
        { type: 'text', content: '仅包含文本生成模型。费用为中国内地公有云官方参考价（每百万Token）。' },
        { type: 'link', text: '查看教程', link: TUTORIAL_DOC_URL },
        { type: 'link', text: '模型与价格文档', link: MODEL_DOC_URL },
      ],
      props: {
        options: MODEL_OPTIONS,
        placeholder: '选择百炼文本模型',
      },
    },
    {
      key: 'model_custom',
      label: '自定义模型ID',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        { type: 'text', content: '仅在模型选择“自定义模型”时填写。' },
        { type: 'link', text: '查看可用模型ID', link: MODEL_DOC_URL },
      ],
      props: {
        placeholder: '例如：qwen-plus',
      },
    },
    {
      key: 'instruction',
      label: '提示词',
      component: FieldComponent.Input,
      validator: { required: true },
      props: {
        placeholder: '请输入要生成的文本要求',
      },
    },
    {
      key: 'reasoning_effort',
      label: '思考模式',
      component: FieldComponent.Radio,
      validator: { required: false },
      defaultValue: { label: '关闭', value: 'off' },
      tooltips: [
        { type: 'text', content: '开启后会传入 enable_thinking=true，仅部分模型支持，且输出单价更高。' },
      ],
      props: {
        options: [
          { label: '关闭', value: 'off' },
          { label: '开启', value: 'on' },
        ],
      },
    },
    {
      key: 'apikey',
      label: '百炼 API Key',
      component: FieldComponent.Input,
      validator: { required: true },
      tooltips: [
        { type: 'link', text: '查看教程', link: TUTORIAL_DOC_URL },
        { type: 'link', text: '首次调用说明', link: FIRST_CALL_DOC_URL },
      ],
      props: {
        placeholder: 'sk-...',
      },
    },
    {
      key: 'request_url',
      label: '请求地址',
      component: FieldComponent.Input,
      validator: { required: false },
      defaultValue: DEFAULT_REQUEST_URL,
      tooltips: [
        { type: 'text', content: '默认使用百炼 OpenAI 兼容接口。仅允许 dashscope.aliyuncs.com。' },
      ],
      props: {
        placeholder: DEFAULT_REQUEST_URL,
      },
    },
  ],
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        { key: 'id', isGroupByKey: true, type: FieldType.Text, label: 'id', title: 'id', hidden: true },
        { key: 'result', type: FieldType.Text, label: '输出结果', title: '输出结果', primary: true },
        { key: 'thinking', type: FieldType.Text, label: '思考内容', title: '思考内容' },
        { key: 'token_usage', type: FieldType.Text, label: 'Token用量', title: 'Token用量' },
        { key: 'estimated_cost_cny', type: FieldType.Number, label: '预估费用(¥)', title: '预估费用(¥)', extra: { formatter: NumberFormatter.DIGITAL_ROUNDED_4 } },
      ],
    },
  },
  execute: async (formItemParams: any, context: any) => {
    const logID = context?.logID || 'no-log-id';
    const modelValue = formItemParams?.model?.value ?? formItemParams?.model;
    const selectedModel = modelValue === 'custom' ? trimString(formItemParams?.model_custom) : trimString(modelValue);
    const prompt = trimString(formItemParams?.instruction);
    const apiKey = trimString(formItemParams?.apikey);
    const requestUrl = trimString(formItemParams?.request_url) || DEFAULT_REQUEST_URL;
    const thinkingEnabled = (formItemParams?.reasoning_effort?.value ?? formItemParams?.reasoning_effort) === 'on';

    if (!selectedModel) {
      return { code: FieldCode.ConfigError, msg: '请选择模型，或填写有效的自定义模型ID。' };
    }
    if (!prompt) {
      return { code: FieldCode.ConfigError, msg: '请输入提示词。' };
    }
    if (!apiKey) {
      return { code: FieldCode.ConfigError, msg: '请填写百炼 API Key。' };
    }

    let url: URL;
    try {
      url = new URL(requestUrl);
    } catch {
      return { code: FieldCode.ConfigError, msg: '请求地址不是有效 URL。' };
    }
    if (url.hostname !== 'dashscope.aliyuncs.com') {
      return { code: FieldCode.ConfigError, msg: '请求地址域名必须为 dashscope.aliyuncs.com。' };
    }

    const modelConfig = resolveModelConfig(selectedModel);
    const messages = [{ role: 'user', content: prompt }];

    const requestBody: any = {
      model: selectedModel,
      messages,
      stream: false,
      max_tokens: 4096,
    };
    const thinkingApplied = Boolean(modelConfig?.supportsThinking && thinkingEnabled);
    if (modelConfig?.supportsThinking) {
      requestBody.enable_thinking = thinkingEnabled;
    } else if (thinkingEnabled) {
      console.log(`[${logID}] step=thinking_ignored model=${selectedModel} reason=model_not_supported`);
    }

    try {
      console.log(`[${logID}] step=request_prepare model=${selectedModel} url=${requestUrl}`);
      const response = await context.fetch(requestUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[${logID}] step=request_error status=${response.status} body=${truncateText(errorText)}`);
        if (response.status === 401 || response.status === 403) {
          return { code: FieldCode.AuthorizationError, msg: 'API Key 无效或无权限。' };
        }
        if (response.status === 429) {
          return { code: FieldCode.RateLimit, msg: '请求过于频繁，请稍后重试。' };
        }
        if (response.status === 400) {
          return { code: FieldCode.InvalidArgument, msg: `请求参数错误：${truncateText(errorText)}` };
        }
        if (response.status === 402) {
          return { code: FieldCode.QuotaExhausted, msg: '配额不足，请检查百炼账户余额与额度。' };
        }
        return { code: FieldCode.Error, msg: `百炼接口调用失败(${response.status})：${truncateText(errorText)}` };
      }

      const payload = await response.json();
      const choice = payload?.choices?.[0];
      if (!choice || !choice.message) {
        console.error(`[${logID}] step=response_parse_error payload=${truncateText(JSON.stringify(payload))}`);
        return { code: FieldCode.Error, msg: '接口返回缺少 choices.message。' };
      }

      const resultTextRaw = normalizeContent(choice.message.content);
      const reasoningText = normalizeContent(choice.message.reasoning_content ?? choice.message.reasoning);
      const usage = payload?.usage || {};
      const inputTokens = parseTokenCount(usage.prompt_tokens);
      const outputTokens = parseTokenCount(usage.completion_tokens);
      const reasoningTokens = parseTokenCount(usage?.completion_tokens_details?.reasoning_tokens);
      const cachedTokens = parseTokenCount(usage?.prompt_tokens_details?.cached_tokens);
      const totalTokens = parseTokenCount(usage.total_tokens) || inputTokens + outputTokens;
      const tokenUsage = `输入:${inputTokens} | 输出:${outputTokens} | 思考:${reasoningTokens} | 总计:${totalTokens}`;
      const resultText = resultTextRaw || (thinkingApplied ? reasoningText : '') || '（无文本输出）';

      let estimatedCost = 0;

      if (modelConfig) {
        const tier = selectPriceTier(modelConfig.tiers, inputTokens);
        let outputPartCost = 0;
        if (thinkingApplied && tier.thinkingOutputPerMillion !== undefined && reasoningTokens > 0) {
          const normalOutputTokens = Math.max(0, outputTokens - reasoningTokens);
          outputPartCost =
            (normalOutputTokens * tier.outputPerMillion + reasoningTokens * tier.thinkingOutputPerMillion) / 1_000_000;
        } else {
          outputPartCost = (outputTokens * tier.outputPerMillion) / 1_000_000;
        }
        estimatedCost = inputTokens * tier.inputPerMillion / 1_000_000 + outputPartCost;
      }

      console.log(`[${logID}] step=success model=${payload?.model || selectedModel} prompt_tokens=${inputTokens} completion_tokens=${outputTokens} reasoning_tokens=${reasoningTokens} estimated_cost=${estimatedCost.toFixed(6)}`);

      return {
        code: FieldCode.Success,
        data: {
          id: trimString(payload?.id) || `run-${logID}`,
          result: resultText,
          primaryProperty: resultText,
          thinking: reasoningText,
          token_usage: tokenUsage,
          // 兼容旧配置缓存，避免执行窗口期出现 execute.result 错误
          model_used: trimString(payload?.model) || selectedModel,
          finish_reason: trimString(choice.finish_reason),
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          reasoning_tokens: reasoningTokens,
          cached_tokens: cachedTokens,
          total_tokens: totalTokens,
          estimated_cost_cny: Number(estimatedCost.toFixed(6)),
          cost: Number(estimatedCost.toFixed(6)),
        },
      };
    } catch (error: any) {
      console.error(`[${logID}] step=execute_exception error=${truncateText(String(error))}`);
      return {
        code: FieldCode.Error,
        msg: `执行异常：${truncateText(String(error))}`,
      };
    }
  },
});

export default basekit;
