"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
// 定义允许访问的域名列表 - OpenRouter 相关
block_basekit_server_api_1.basekit.addDomainList([
    'openrouter.ai',
    'feishu.cn',
    'feishucdn.com',
    'larksuitecdn.com',
    'larksuite.com'
]);
// 定义字段
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: 'model',
            label: '模型名称',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: false },
            tooltips: [
                { type: 'link', text: '查看所有可用模型', link: 'https://openrouter.ai/models' }
            ],
            props: { placeholder: '格式: provider/model-name, 例如: openai/gpt-5.2' }
        },
        {
            key: 'instruction',
            label: '提示词（Prompt）',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            props: { placeholder: '请输入对话指令' }
        },
        {
            key: 'reasoning_effort',
            label: '深度思考模式',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.Radio,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: true },
            tooltips: [
                { type: 'link', text: '获取 Key', link: 'https://openrouter.ai/settings/keys' }
            ],
            props: { placeholder: 'sk-or-v1-...' }
        },
        {
            key: 'request_url',
            label: '请求地址 (OpenRouter API)',
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: false },
            props: { placeholder: '默认 4096' }
        },
        {
            key: 'temperature',
            label: '温度参数 (Temperature)',
            component: block_basekit_server_api_1.FieldComponent.Input,
            validator: { required: false },
            props: { placeholder: '默认 1.0，范围 0-2' }
        }
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: { light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg' },
            properties: [
                { key: 'id', isGroupByKey: true, type: block_basekit_server_api_1.FieldType.Text, label: 'id', title: 'id', hidden: true },
                { key: 'result', type: block_basekit_server_api_1.FieldType.Text, label: '输出结果', title: '输出结果', primary: true },
                { key: 'thinking', type: block_basekit_server_api_1.FieldType.Text, label: '思考过程', title: '思考过程' },
                { key: 'input_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '输入 Token', title: '输入 Token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } },
                { key: 'output_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '输出 Token', title: '输出 Token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } },
                { key: 'reasoning_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '推理 Token', title: '推理 Token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } },
                { key: 'cached_tokens', type: block_basekit_server_api_1.FieldType.Number, label: '缓存命中 Token', title: '缓存命中 Token', extra: { formatter: block_basekit_server_api_1.NumberFormatter.INTEGER } },
                { key: 'cost', type: block_basekit_server_api_1.FieldType.Number, label: '费用 ($)', title: '费用 ($)', extra: { formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_4 } },
                { key: 'model_used', type: block_basekit_server_api_1.FieldType.Text, label: '实际调用模型', title: '实际调用模型' }
            ]
        }
    },
    execute: async (formItemParams, context) => {
        const { model, model_custom, instruction, apikey, request_url, max_tokens, temperature, web_search, reasoning_effort } = formItemParams;
        // 1. 确定最终使用的模型名称
        let finalModel;
        if (model?.value === 'custom') {
            finalModel = model_custom;
        }
        else {
            finalModel = model?.value || model;
        }
        if (!finalModel) {
            return { code: block_basekit_server_api_1.FieldCode.ConfigError, msg: '请选择或输入有效的模型名称' };
        }
        // 2. 准备输入内容
        let userContent = instruction;
        // 3. 准备请求参数
        const requestUrl = request_url || 'https://openrouter.ai/api/v1/chat/completions';
        const maxTokens = max_tokens ? parseInt(max_tokens, 10) : 4096;
        const tempValue = temperature ? parseFloat(temperature) : undefined;
        // 辅助函数：从 OpenRouter 获取模型价格
        const fetchModelPrice = async (targetModel) => {
            try {
                const res = await context.fetch('https://openrouter.ai/api/v1/models', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok)
                    return null;
                const data = await res.json();
                if (data && Array.isArray(data.data)) {
                    // 查找匹配的模型
                    const modelInfo = data.data.find((m) => m.id === targetModel);
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
            }
            catch (e) {
                console.error(`[${context.logID}] Fetch model price failed:`, e);
                return null;
            }
        };
        try {
            console.log(`[${context.logID}] Starting request with model: ${finalModel}`);
            // 4. 构建请求体
            const requestBody = {
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
                    effort: reasoningEffortValue // 'none' 或 'high'
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
                        code: block_basekit_server_api_1.FieldCode.AuthorizationError,
                        msg: 'API Key 无效或已过期，请检查您的 OpenRouter API Key'
                    };
                }
                if (chatRes.status === 429) {
                    return {
                        code: block_basekit_server_api_1.FieldCode.RateLimit,
                        msg: '请求频率过高，请稍后再试'
                    };
                }
                if (chatRes.status === 402) {
                    return {
                        code: block_basekit_server_api_1.FieldCode.QuotaExhausted,
                        msg: 'OpenRouter 账户余额不足，请充值后再试'
                    };
                }
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    msg: `API 请求失败: ${chatRes.status} - ${errText}`
                };
            }
            const chatData = await chatRes.json();
            console.log(`[${context.logID}] Response received from model: ${chatData.model}`);
            // 7. 提取结果
            const choice = chatData.choices?.[0];
            if (!choice) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
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
            }
            else if (message?.reasoning) {
                thinkingText = message.reasoning;
            }
            // 处理某些模型（如 Gemini 3）在深度思考模式下只返回 reasoning 而没有 content 的情况
            // 如果 result 为空但 thinking 有内容，说明模型可能还在思考中或 API 返回结构异常
            if (!resultText && thinkingText) {
                console.log(`[${context.logID}] Warning: content is empty but reasoning exists. Model may still be thinking or need more tokens.`);
                // 尝试从 reasoning_details 中提取最终内容（部分模型会这样返回）
                if (message?.reasoning_details && Array.isArray(message.reasoning_details)) {
                    const textDetails = message.reasoning_details.filter((d) => d.type === 'reasoning.text');
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
            }
            else if (priceInfo) {
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
                }
                else if (reasoningTokens > 0) {
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
                code: block_basekit_server_api_1.FieldCode.Success,
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
        }
        catch (e) {
            console.error(`[${context.logID}] Execute error:`, e);
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                msg: `执行出错: ${String(e)}`
            };
        }
    }
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBc0g7QUFFdEgsOEJBQThCO0FBQzlCLGtDQUFPLENBQUMsYUFBYSxDQUFDO0lBQ3BCLGVBQWU7SUFDZixXQUFXO0lBQ1gsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixlQUFlO0NBQ2hCLENBQUMsQ0FBQztBQXVCSCxPQUFPO0FBQ1Asa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxPQUFPO1lBQ1osS0FBSyxFQUFFLE1BQU07WUFDYixTQUFTLEVBQUUseUNBQWMsQ0FBQyxZQUFZO1lBQ3RDLFNBQVMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7WUFDN0IsUUFBUSxFQUFFO2dCQUNSLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxpRkFBaUYsRUFBRTthQUMxSDtZQUNELEtBQUssRUFBRTtnQkFDTCxPQUFPLEVBQUU7b0JBQ1AsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFO29CQUN0RCxFQUFFLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxLQUFLLEVBQUUsK0JBQStCLEVBQUU7b0JBQzVFLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLEtBQUssRUFBRSw2QkFBNkIsRUFBRTtvQkFDeEUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7b0JBQ2hELEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUU7b0JBQ3ZELEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFFLEtBQUssRUFBRSw2QkFBNkIsRUFBRTtvQkFDMUUsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLGdC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