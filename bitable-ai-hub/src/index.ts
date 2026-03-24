import { basekit, FieldType, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';

// 定义允许访问的域名列表 - OpenRouter 相关
basekit.addDomainList([
  'openrouter.ai',
  'feishu.cn',
  'feishucdn.com',
  'larksuitecdn.com',
  'larksuite.com'
]);

// 定价信息接口
interface PricingInfo {
  prompt: number;      // 每 token 输入价格
  completion: number;  // 每 token 输出价格
  request?: number;    // 每请求固定费用
  image?: number;      // 图像输入费用
  web_search?: number; // 网络搜索费用
  input_cache_read?: number;  // 缓存读取费用
  input_cache_write?: number; // 缓存写入费用
  internal_reasoning?: number; // 推理 token 费用
  currency: string;
}

// 模型信息接口
interface ModelInfo {
  id: string;
  name: string;
  pricing: PricingInfo;
  context_length: number;
}

// 定义字段
basekit.addField({
  formItems: [
    {
      key: 'model',
      label: '模型名称',
      component: FieldComponent.SingleSelect,
      validator: { required: true },
      tooltips: [
        { type: 'link', text: '查看使用教程', link: 'https://foodtalks.feishu.cn/docx/AbzsdRhOooix0Sx6nbtcvlGDnHb?from=from_copylink' }
      ],
      props: {
        options: [
          { label: 'OpenAI - GPT-5.2', value: 'openai/gpt-5.2' },
          { label: 'Google - Gemini 3 Flash', value: 'google/gemini-3-flash-preview' },
          { label: 'Google - Gemini 3 Pro', value: 'google/gemini-3-pro-preview' },
          { label: '智谱 - GLM-4.7', value: 'z-ai/glm-4.7' },
          { label: 'Kimi - K2.5', value: 'moonshotai/kimi-k2.5' },
          { label: 'Kimi - K2 Thinking (推理)', value: 'moonshotai/kimi-k2-thinking' },
          { label: 'Qwen - Qwen3 32B', value: 'qwen/qwen3-32b' },
          { label: 'Qwen - Qwen3 235B', value: 'qwen/qwen3-235b-a22b-2507' },
          { label: '其他自定义模型', value: 'custom' }
        ],
        placeholder: '选择模型'
      }
    },
    {
      key: 'model_custom',
      label: '填入自定义模型名称',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        { type: 'link', text: '查看所有可用模型', link: 'https://openrouter.ai/models' }
      ],
      props: { placeholder: '格式: provider/model-name, 例如: openai/gpt-5.2' }
    },
    {
      key: 'instruction',
      label: '提示词（Prompt）',
      component: FieldComponent.Input,
      validator: { required: true },
      props: { placeholder: '请输入对话指令' }
    },
    {
      key: 'reasoning_effort',
      label: '深度思考模式',
      component: FieldComponent.SingleSelect,
      validator: { required: false },
      tooltips: [
        { type: 'text', content: '控制模型是否进行深度推理。不支持深度思考的模型会忽略此设置。可在模型详情页查看是否支持 Reasoning。' },
        { type: 'link', text: '查看模型详情', link: 'https://openrouter.ai/models' }
      ],
      props: {
        options: [
          { label: '默认（模型自动判断）', value: 'default' },
          { label: '关闭深度思考', value: 'none' },
          { label: '开启深度思考', value: 'high' }
        ],
        placeholder: '选择思考模式'
      }
    },
    {
      key: 'web_search',
      label: '启用联网搜索',
      component: FieldComponent.Radio,
      validator: { required: false },
      tooltips: [
        { type: 'text', content: '开启后模型会联网搜索最新信息，会产生额外费用（参考：部分模型约 $0.002/次，具体以 OpenRouter 定价 pricing.web_search 为准）' }
      ],
      defaultValue: { label: '关闭', value: 'off' },
      props: {
        options: [
          { label: '关闭', value: 'off' },
          { label: '开启', value: 'on' }
        ],
        placeholder: '默认关闭'
      }
    },
    {
      key: 'apikey',
      label: 'OpenRouter API Key',
      component: FieldComponent.Input,
      validator: { required: true },
      tooltips: [
        { type: 'link', text: '获取 Key', link: 'https://openrouter.ai/settings/keys' }
      ],
      props: { placeholder: 'sk-or-v1-...' }
    },
    {
      key: 'request_url',
      label: '请求地址 (OpenRouter API)',
      component: FieldComponent.Input,
      validator: { required: false },
      tooltips: [
        { type: 'text', content: '仅支持 openrouter.ai 域名；可按需修改路径后缀。默认使用 Chat Completions 接口。' },
        { type: 'link', text: '查看 OpenRouter API 文档', link: 'https://openrouter.ai/docs/quickstart' }
      ],
      defaultValue: 'https://openrouter.ai/api/v1/chat/completions',
      props: { placeholder: '例如：https://openrouter.ai/api/v1/chat/completions' }
    },
    {
      key: 'max_tokens',
      label: '最大输出 Token',
      component: FieldComponent.Input,
      validator: { required: false },
      props: { placeholder: '默认 4096' }
    },
    {
      key: 'temperature',
      label: '温度参数 (Temperature)',
      component: FieldComponent.Input,
      validator: { required: false },
      props: { placeholder: '默认 1.0，范围 0-2' }
    }
  ],
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: { light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg' },
      properties: [
        { key: 'id', isGroupByKey: true, type: FieldType.Text, label: 'id', title: 'id', hidden: true },
        { key: 'result', type: FieldType.Text, label: '输出结果', title: '输出结果', primary: true },
        { key: 'thinking', type: FieldType.Text, label: '思考过程', title: '思考过程' },
        { key: 'input_tokens', type: FieldType.Number, label: '输入 Token', title: '输入 Token', extra: { formatter: NumberFormatter.INTEGER } },
        { key: 'output_tokens', type: FieldType.Number, label: '输出 Token', title: '输出 Token', extra: { formatter: NumberFormatter.INTEGER } },
        { key: 'reasoning_tokens', type: FieldType.Number, label: '推理 Token', title: '推理 Token', extra: { formatter: NumberFormatter.INTEGER } },
        { key: 'cached_tokens', type: FieldType.Number, label: '缓存命中 Token', title: '缓存命中 Token', extra: { formatter: NumberFormatter.INTEGER } },
        { key: 'cost', type: FieldType.Number, label: '费用 ($)', title: '费用 ($)', extra: { formatter: NumberFormatter.DIGITAL_ROUNDED_4 } },
        { key: 'model_used', type: FieldType.Text, label: '实际调用模型', title: '实际调用模型' }
      ]
    }
  },
  execute: async (formItemParams: any, context: any) => {
    const {
      model,
      model_custom,
      instruction,
      apikey,
      request_url,
      max_tokens,
      temperature,
      web_search,
      reasoning_effort
    } = formItemParams;

    // 1. 确定最终使用的模型名称
    let finalModel: string;
    if (model?.value === 'custom') {
      finalModel = model_custom;
    } else {
      finalModel = model?.value || model;
    }
    
    if (!finalModel) {
      return { code: FieldCode.ConfigError, msg: '请选择或输入有效的模型名称' };
    }

    // 2. 准备输入内容
    let userContent = instruction;

    // 3. 准备请求参数
    const requestUrl = request_url || 'https://openrouter.ai/api/v1/chat/completions';
    const maxTokens = max_tokens ? parseInt(max_tokens, 10) : 4096;
    const tempValue = temperature ? parseFloat(temperature) : undefined;

    // 辅助函数：从 OpenRouter 获取模型价格
    const fetchModelPrice = async (targetModel: string): Promise<PricingInfo | null> => {
      try {
        const res = await context.fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) return null;

        const data = await res.json();
        if (data && Array.isArray(data.data)) {
          // 查找匹配的模型
          const modelInfo = data.data.find((m: any) => m.id === targetModel);
          
          if (modelInfo?.pricing) {
            const pricing = modelInfo.pricing;
            return {
              prompt: parseFloat(pricing.prompt || '0'),
              completion: parseFloat(pricing.completion || '0'),
              request: pricing.request ? parseFloat(pricing.request) : undefined,
              image: pricing.image ? parseFloat(pricing.image) : undefined,
              web_search: pricing.web_search ? parseFloat(pricing.web_search) : undefined,
              input_cache_read: pricing.input_cache_read ? parseFloat(pricing.input_cache_read) : undefined,
              input_cache_write: pricing.input_cache_write ? parseFloat(pricing.input_cache_write) : undefined,
              internal_reasoning: pricing.internal_reasoning ? parseFloat(pricing.internal_reasoning) : undefined,
              currency: 'USD'
            };
          }
        }
        return null;
      } catch (e) {
        console.error(`[${context.logID}] Fetch model price failed:`, e);
        return null;
      }
    };

    try {
      console.log(`[${context.logID}] Starting request with model: ${finalModel}`);

      // 4. 构建请求体
      const requestBody: any = {
        model: finalModel,
        messages: [
          { role: 'user', content: userContent }
        ],
        max_tokens: maxTokens,
        stream: false
      };

      // 添加可选参数
      if (tempValue !== undefined && !isNaN(tempValue)) {
        requestBody.temperature = tempValue;
      }

      // 添加深度思考参数
      const reasoningEffortValue = reasoning_effort?.value || 'default';
      if (reasoningEffortValue !== 'default') {
        // OpenRouter 使用 reasoning 参数控制推理
        // effort: "none" 关闭推理, "low"/"medium"/"high" 开启不同程度推理
        requestBody.reasoning = {
          effort: reasoningEffortValue  // 'none' 或 'high'
        };
        console.log(`[${context.logID}] Reasoning effort set to: ${reasoningEffortValue}`);
      }

      // 添加联网搜索插件
      const enableWebSearch = web_search?.value === 'on';
      if (enableWebSearch) {
        requestBody.plugins = [
          { id: 'web' }
        ];
        console.log(`[${context.logID}] Web search enabled`);
      }

      // 5. 并行执行: 发送对话请求 + 获取价格信息
      const chatPromise = context.fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apikey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://feishu.cn',
          'X-Title': 'Feishu Bitable Field Plugin'
        },
        body: JSON.stringify(requestBody)
      });

      const pricePromise = fetchModelPrice(finalModel);

      const [chatRes, priceInfo] = await Promise.all([chatPromise, pricePromise]);

      // 6. 处理对话响应
      if (!chatRes.ok) {
        const errText = await chatRes.text();
        console.error(`[${context.logID}] API request failed: ${chatRes.status} - ${errText}`);
        
        // 处理常见错误
        if (chatRes.status === 401) {
          return { 
            code: FieldCode.AuthorizationError, 
            msg: 'API Key 无效或已过期，请检查您的 OpenRouter API Key' 
          };
        }
        if (chatRes.status === 429) {
          return { 
            code: FieldCode.RateLimit, 
            msg: '请求频率过高，请稍后再试' 
          };
        }
        if (chatRes.status === 402) {
          return { 
            code: FieldCode.QuotaExhausted, 
            msg: 'OpenRouter 账户余额不足，请充值后再试' 
          };
        }
        
        return { 
          code: FieldCode.Error, 
          msg: `API 请求失败: ${chatRes.status} - ${errText}` 
        };
      }

      const chatData = await chatRes.json();
      console.log(`[${context.logID}] Response received from model: ${chatData.model}`);
      
      // 7. 提取结果
      const choice = chatData.choices?.[0];
      if (!choice) {
        return { 
          code: FieldCode.Error, 
          msg: '未收到有效的模型响应' 
        };
      }

      // 提取内容 - 支持 message（非流式）和 delta（流式）
      const message = choice.message || choice.delta;
      let resultText = message?.content || '';
      
      // 提取思维链内容（如果有）
      // OpenRouter 对于支持思维链的模型会在 reasoning_content 或 reasoning 字段返回
      let thinkingText = '';
      if (message?.reasoning_content) {
        thinkingText = message.reasoning_content;
      } else if (message?.reasoning) {
        thinkingText = message.reasoning;
      }
      
      // 处理某些模型（如 Gemini 3）在深度思考模式下只返回 reasoning 而没有 content 的情况
      // 如果 result 为空但 thinking 有内容，说明模型可能还在思考中或 API 返回结构异常
      if (!resultText && thinkingText) {
        console.log(`[${context.logID}] Warning: content is empty but reasoning exists. Model may still be thinking or need more tokens.`);
        // 尝试从 reasoning_details 中提取最终内容（部分模型会这样返回）
        if (message?.reasoning_details && Array.isArray(message.reasoning_details)) {
          const textDetails = message.reasoning_details.filter((d: any) => d.type === 'reasoning.text');
          if (textDetails.length > 0) {
            // 取最后一个 reasoning.text 作为可能的最终结果
            const lastText = textDetails[textDetails.length - 1];
            if (lastText?.text) {
              thinkingText = lastText.text;
            }
          }
        }
      }

      // 8. 提取 Token 用量
      const usage = chatData.usage || {};
      const inputTokens = usage.prompt_tokens || 0;
      const outputTokens = usage.completion_tokens || 0;
      
      // 详细的 token 信息
      const promptDetails = usage.prompt_tokens_details || {};
      const completionDetails = usage.completion_tokens_details || {};
      
      const cachedTokens = promptDetails.cached_tokens || 0;
      const cacheWriteTokens = promptDetails.cache_write_tokens || 0;
      const reasoningTokens = completionDetails.reasoning_tokens || 0;

      // 9. 计算费用
      let cost = 0;
      
      // 优先使用 OpenRouter 返回的费用
      if (usage.cost !== undefined) {
        cost = usage.cost;
      } else if (priceInfo) {
        // 否则使用获取的价格信息计算
        // 基础输入费用
        const regularInputTokens = Math.max(0, inputTokens - cachedTokens - cacheWriteTokens);
        cost += regularInputTokens * priceInfo.prompt;
        
        // 缓存读取费用
        if (priceInfo.input_cache_read && cachedTokens > 0) {
          cost += cachedTokens * priceInfo.input_cache_read;
        }
        
        // 缓存写入费用
        if (priceInfo.input_cache_write && cacheWriteTokens > 0) {
          cost += cacheWriteTokens * priceInfo.input_cache_write;
        }
        
        // 输出费用（不包括推理 token）
        const regularOutputTokens = Math.max(0, outputTokens - reasoningTokens);
        cost += regularOutputTokens * priceInfo.completion;
        
        // 推理 token 费用
        if (priceInfo.internal_reasoning && reasoningTokens > 0) {
          cost += reasoningTokens * priceInfo.internal_reasoning;
        } else if (reasoningTokens > 0) {
          // 如果没有单独的推理价格，按输出价格计算
          cost += reasoningTokens * priceInfo.completion;
        }
        
        // 请求固定费用
        if (priceInfo.request) {
          cost += priceInfo.request;
        }
      }

      console.log(`[${context.logID}] Request completed. Input: ${inputTokens}, Output: ${outputTokens}, Cost: $${cost.toFixed(6)}`);

      return {
        code: FieldCode.Success,
        data: {
          id: chatData.id || `gen-${Date.now()}`,
          result: resultText,
          thinking: thinkingText,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          reasoning_tokens: reasoningTokens,
          cached_tokens: cachedTokens,
          cost: parseFloat(cost.toFixed(6)),
          model_used: chatData.model || finalModel
        }
      };

    } catch (e) {
      console.error(`[${context.logID}] Execute error:`, e);
      return { 
        code: FieldCode.Error, 
        msg: `执行出错: ${String(e)}` 
      };
    }
  }
});

export default basekit;
