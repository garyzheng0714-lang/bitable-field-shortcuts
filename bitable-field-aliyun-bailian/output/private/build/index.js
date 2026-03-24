"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// Allow Aliyun DashScope API domain
block_basekit_server_api_1.basekit.addDomainList(['dashscope.aliyuncs.com']);
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh-CN': {
                'apiKey': '阿里云百炼 API Key',
                'apiKeyPlaceholder': '请输入您的 DashScope API Key (sk-...)',
                'model': '选择模型',
                'customModel': '其他模型名称',
                'customModelPlaceholder': '请输入模型名称（如 qwen-max-longcontext）（仅当选择自定义模型时生效，非必填）',
                'customModelTooltip': '仅当上面的“选择模型”字段选中“其他模型 (自定义)”时，此字段才生效。若未选择自定义模型，此字段将被忽略。',
                'prompt': '提示词',
                'promptPlaceholder': '请输入提示词',
                'internetSearch': '联网搜索配置',
                'result': 'AI 回复内容',
                'estimatedCost': '预估费用(元)',
                'tokenUsage': 'Token 消耗 (总/入/出)',
            },
            'en-US': {
                'apiKey': 'Aliyun Bailian API Key',
                'apiKeyPlaceholder': 'Enter DashScope API Key (sk-...)',
                'model': 'Model',
                'customModel': 'Custom Model Name',
                'customModelPlaceholder': 'Enter model name (e.g. qwen-max-longcontext) (Only valid when Custom Model is selected, Optional)',
                'customModelTooltip': 'This field is only effective when "Other Model (Custom)" is selected in the "Model" field above. Otherwise, it will be ignored.',
                'prompt': 'Prompt',
                'promptPlaceholder': 'Enter prompt',
                'internetSearch': 'Internet Search',
                'result': 'AI Response',
                'estimatedCost': 'Estimated Cost(CNY)',
                'tokenUsage': 'Token Usage (Total/In/Out)',
            },
            'ja-JP': {
                'apiKey': 'Aliyun Bailian APIキー',
                'apiKeyPlaceholder': 'DashScope APIキーを入力 (sk-...)',
                'model': 'モデル',
                'customModel': 'カスタムモデル名',
                'customModelPlaceholder': 'モデル名を入力 (例: qwen-max-longcontext) (カスタムモデル選択時のみ有効、任意)',
                'customModelTooltip': '上の「モデル」フィールドで「その他のモデル (カスタム)」が選択されている場合のみ有効です。それ以外の場合は無視されます。',
                'prompt': 'プロンプト',
                'promptPlaceholder': 'プロンプトを入力',
                'internetSearch': 'インターネット検索',
                'result': 'AI応答',
                'estimatedCost': '推定費用(元)',
                'tokenUsage': 'トークン使用量 (合計/入/出)',
            }
        }
    },
    formItems: [
        {
            key: 'prompt',
            label: t('prompt'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('promptPlaceholder'),
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'model',
            label: t('model'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '通义千问-Flash (Qwen-Flash)', value: 'qwen-flash' },
                    { label: '通义千问-Plus (Qwen-Plus)', value: 'qwen-plus' },
                    { label: '通义千问3-Max (Qwen3-Max)', value: 'qwen3-max' },
                    { label: '其他模型 (自定义)', value: 'custom' },
                ],
                placeholder: 'Select a model'
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'customModel',
            label: t('customModel'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('customModelPlaceholder'),
            },
            tooltips: [
                {
                    type: 'text',
                    content: t('customModelTooltip'),
                }
            ],
            validator: {
                required: false,
            }
        },
        {
            key: 'internetSearch',
            label: t('internetSearch'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '不开启联网搜索', value: 'none' },
                    { label: '联网搜索（标准 - 免费）', value: 'turbo' },
                    { label: '联网搜索（深度 - 免费）', value: 'max' },
                    { label: '联网搜索（Agent - 0.004元/次）', value: 'agent' }
                ],
                placeholder: '标准/深度搜索免费；Agent搜索按次收费',
            },
            validator: {
                required: false,
            }
        },
        {
            key: 'apiKey',
            label: t('apiKey'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('apiKeyPlaceholder'),
            },
            tooltips: [
                {
                    type: 'link',
                    text: '如何获取API Key？',
                    link: 'https://bailian.console.aliyun.com?tab=model#/api-key',
                }
            ],
            validator: {
                required: true,
            }
        }
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://img.alicdn.com/imgextra/i4/O1CN01c26iB51UyR3MKMWxs_!!6000000002586-2-tps-124-124.png',
            },
            properties: [
                {
                    key: 'content',
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('result'),
                    primary: true,
                },
                {
                    key: 'estimated_cost',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('estimatedCost'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_4
                    }
                },
                {
                    key: 'token_usage',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('tokenUsage'),
                }
            ],
        },
    },
    execute: async (formItemParams, context) => {
        const { apiKey, model, customModel, prompt, internetSearch } = formItemParams;
        function debugLog(arg) {
            console.log(JSON.stringify({
                logID: context.logID,
                arg
            }));
        }
        // Determine actual model to use
        // FieldComponent.SingleSelect can return an object {label: string, value: string} or just value string
        let modelValue = model;
        if (typeof model === 'object' && model !== null && 'value' in model) {
            modelValue = model.value;
        }
        let actualModel = modelValue;
        if (modelValue === 'custom') {
            if (!customModel || !customModel.trim()) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Success, // Return success to show error in field
                    data: {
                        content: '',
                        usage: 0,
                        finish_reason: 'error',
                        error: 'Custom model name is required when "Other Model" is selected.'
                    }
                };
            }
            actualModel = customModel.trim();
        }
        // Parse internetSearch
        let searchEnabled = false;
        let strategy = 'turbo';
        let searchOption = internetSearch;
        if (typeof internetSearch === 'object' && internetSearch !== null && 'value' in internetSearch) {
            searchOption = internetSearch.value;
        }
        // Handle undefined/null (default to none)
        if (!searchOption || searchOption === 'none') {
            searchEnabled = false;
        }
        else {
            searchEnabled = true;
            strategy = String(searchOption);
        }
        debugLog({ msg: 'Start executing', model: actualModel, hasApiKey: !!apiKey, promptLength: prompt?.length, searchEnabled, strategy });
        if (!apiKey) {
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                msg: 'API Key is missing'
            };
        }
        // Validate API Key format
        const apiKeyPattern = /^sk-[a-zA-Z0-9]+$/;
        if (!apiKeyPattern.test(apiKey)) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    content: '',
                    usage: 0,
                    finish_reason: 'error',
                    error: 'Invalid API Key format. Must start with "sk-" followed by alphanumeric characters.'
                }
            };
        }
        // Handle prompt text extraction
        // Since component is now Input, prompt is a string. Keeping compatibility logic just in case.
        let promptText = '';
        if (prompt === null || prompt === undefined) {
            promptText = '';
        }
        else if (typeof prompt === 'string') {
            promptText = prompt;
        }
        else if (Array.isArray(prompt)) {
            promptText = prompt.map((item) => item.text || '').join('');
        }
        else {
            promptText = String(prompt);
        }
        if (!promptText.trim()) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    content: '',
                    usage: 0,
                    finish_reason: 'empty_prompt',
                    error: 'Prompt is empty'
                }
            };
        }
        const url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        const requestBody = {
            model: actualModel,
            messages: [
                { role: 'user', content: promptText }
            ]
        };
        if (searchEnabled) {
            requestBody.enable_search = true;
            requestBody.search_options = {
                forced_search: true,
                search_strategy: strategy
            };
        }
        try {
            const response = await context.fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const errorText = await response.text();
                debugLog({ error: 'API Error', status: response.status, body: errorText });
                // Attempt to parse error JSON
                let parsedError = errorText;
                try {
                    const errJson = JSON.parse(errorText);
                    parsedError = errJson.message || errJson.error?.message || errorText;
                }
                catch (e) { }
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        content: '',
                        usage: 0,
                        finish_reason: 'error',
                        error: `API Error ${response.status}: ${parsedError}`
                    }
                };
            }
            const data = await response.json();
            debugLog({ msg: 'API Success', usage: data.usage });
            const content = data.choices?.[0]?.message?.content || '';
            const usage = data.usage?.total_tokens || 0;
            const input_tokens = data.usage?.prompt_tokens || 0;
            const output_tokens = data.usage?.completion_tokens || 0;
            const finish_reason = data.choices?.[0]?.finish_reason || '';
            // Calculate estimated cost
            let inputPrice = 0;
            let outputPrice = 0;
            // Pricing (CNY per 1000 tokens)
            if (actualModel === 'qwen-flash') {
                inputPrice = 0.00015;
                outputPrice = 0.0015;
            }
            else if (actualModel === 'qwen-plus') {
                inputPrice = 0.0008;
                outputPrice = 0.002;
            }
            else if (actualModel === 'qwen3-max') {
                inputPrice = 0.0032;
                outputPrice = 0.0128;
            }
            else {
                // Fallback or custom model
                inputPrice = 0;
                outputPrice = 0;
            }
            let estimatedCost = (input_tokens / 1000 * inputPrice) + (output_tokens / 1000 * outputPrice);
            // Add search cost if strategy is agent
            if (searchEnabled && strategy === 'agent') {
                estimatedCost += 0.004;
            }
            // Format token usage string
            const tokenUsageStr = `${usage} (入:${input_tokens} / 出:${output_tokens})`;
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    content: content,
                    estimated_cost: estimatedCost,
                    token_usage: tokenUsageStr,
                }
            };
        }
        catch (e) {
            debugLog({ error: 'Exception', msg: e.message });
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    content: '',
                    usage: 0,
                    finish_reason: 'exception',
                    error: `Exception: ${e.message}`
                }
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNkg7QUFDN0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsb0NBQW9DO0FBQ3BDLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0FBRWxELGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixtQkFBbUIsRUFBRSxrQ0FBa0M7Z0JBQ3ZELE9BQU8sRUFBRSxNQUFNO2dCQUNmLGFBQWEsRUFBRSxRQUFRO2dCQUN2Qix3QkFBd0IsRUFBRSxtREFBbUQ7Z0JBQzdFLG9CQUFvQixFQUFFLHdEQUF3RDtnQkFDOUUsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsbUJBQW1CLEVBQUUsUUFBUTtnQkFDN0IsZ0JBQWdCLEVBQUUsUUFBUTtnQkFDMUIsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLGVBQWUsRUFBRSxTQUFTO2dCQUMxQixZQUFZLEVBQUUsa0JBQWtCO2FBQ2pDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLG1CQUFtQixFQUFFLGtDQUFrQztnQkFDdkQsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLGFBQWEsRUFBRSxtQkFBbUI7Z0JBQ2xDLHdCQUF3QixFQUFFLG1HQUFtRztnQkFDN0gsb0JBQW9CLEVBQUUsaUlBQWlJO2dCQUN2SixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsbUJBQW1CLEVBQUUsY0FBYztnQkFDbkMsZ0JBQWdCLEVBQUUsaUJBQWlCO2dCQUNuQyxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsZUFBZSxFQUFFLHFCQUFxQjtnQkFDdEMsWUFBWSxFQUFFLDRCQUE0QjthQUMzQztZQUNE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