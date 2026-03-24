import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// Allow Aliyun DashScope API domain
basekit.addDomainList(['dashscope.aliyuncs.com']);

basekit.addField({
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
        'result': '输出结果',
        'thinkingProcess': '思考过程',
        'estimatedCost': '预估费用(元)',
        'tokenUsage': 'Token 消耗 (总/入/出)',
      }
    }
  },
  formItems: [
    {
      key: 'prompt',
      label: t('prompt'),
      component: FieldComponent.Input,
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
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
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://img.alicdn.com/imgextra/i4/O1CN01c26iB51UyR3MKMWxs_!!6000000002586-2-tps-124-124.png',
      },
      properties: [
        {
          key: 'content',
          isGroupByKey: true,
          type: FieldType.Text,
          label: t('result'),
          primary: true,
        },
        {
          key: 'thinking_process',
          type: FieldType.Text,
          label: t('thinkingProcess'),
        },
        {
          key: 'estimated_cost',
          type: FieldType.Number,
          label: t('estimatedCost'),
          extra: {
             formatter: NumberFormatter.DIGITAL_ROUNDED_4
          }
        },
        {
          key: 'token_usage',
          type: FieldType.Text,
          label: t('tokenUsage'),
        }
      ],
    },
  },
  execute: async (formItemParams, context) => {
    const { apiKey, model, customModel, prompt, internetSearch } = formItemParams;

    function debugLog(arg: any) {
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
                code: FieldCode.Success, // Return success to show error in field
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
    } else {
        searchEnabled = true;
        strategy = String(searchOption);
    }

    debugLog({ msg: 'Start executing', model: actualModel, hasApiKey: !!apiKey, promptLength: prompt?.length, searchEnabled, strategy });

    if (!apiKey) {
        return {
            code: FieldCode.Error,
            msg: 'API Key is missing'
        };
    }
    
    // Validate API Key format
    const apiKeyPattern = /^sk-[a-zA-Z0-9]+$/;
    if (!apiKeyPattern.test(apiKey)) {
         return {
            code: FieldCode.Success,
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
    } else if (typeof prompt === 'string') {
        promptText = prompt;
    } else if (Array.isArray(prompt)) {
        promptText = prompt.map((item: any) => item.text || '').join('');
    } else {
        promptText = String(prompt);
    }

    if (!promptText.trim()) {
         return {
            code: FieldCode.Success,
            data: {
                content: '',
                usage: 0,
                finish_reason: 'empty_prompt',
                error: 'Prompt is empty'
            }
        };
    }

    const url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    
    const requestBody: any = {
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
            } catch (e) {}

            return {
                code: FieldCode.Success,
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
        const reasoning_content = data.choices?.[0]?.message?.reasoning_content || '';
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
    } else if (actualModel === 'qwen-plus') {
        inputPrice = 0.0008;
        outputPrice = 0.002;
    } else if (actualModel === 'qwen3-max') {
        inputPrice = 0.0032;
        outputPrice = 0.0128;
    } else {
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
        code: FieldCode.Success,
        data: {
            content: content,
            thinking_process: reasoning_content,
            estimated_cost: estimatedCost,
            token_usage: tokenUsageStr,
        }
    };

    } catch (e: any) {
        debugLog({ error: 'Exception', msg: e.message });
        return {
            code: FieldCode.Success,
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

export default basekit;
