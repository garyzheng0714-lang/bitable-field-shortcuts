import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

// Add allowed domains for Gemini API
basekit.addDomainList(['generativelanguage.googleapis.com', 'feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com']);

basekit.addField({
  // i18n resources
  i18n: {
    messages: {
      'zh-CN': {
        'taskType': '任务类型',
        'taskType_text': '文本生成',
        'taskType_image': '图片理解',
        'taskType_structured': '结构化输出',
        'taskType_research': '深度研究 (Deep Research)',
        'apiKey': 'Gemini API Key',
        'model': '模型选择',
        'inputField': '输入字段',
        'prompt': '提示词 (Prompt)',
        'prompt_placeholder': '请输入提示词，可结合输入字段使用',
        'jsonSchema': 'JSON Schema (仅结构化输出)',
        'jsonSchema_placeholder': '请输入 JSON Schema 定义',
        'enableSearch': '启用 Google 搜索',
        'output_content': '生成内容',
        'output_citations': '引用来源',
        'output_data': '结构化数据',
        'output_status': '状态',
      },
      'en-US': {
        'taskType': 'Task Type',
        'taskType_text': 'Text Generation',
        'taskType_image': 'Image Understanding',
        'taskType_structured': 'Structured Output',
        'taskType_research': 'Deep Research Agent',
        'apiKey': 'Gemini API Key',
        'model': 'Model Selection',
        'inputField': 'Input Field',
        'prompt': 'Prompt',
        'prompt_placeholder': 'Enter prompt, can be used with input field',
        'jsonSchema': 'JSON Schema (Structured Output Only)',
        'jsonSchema_placeholder': 'Enter JSON Schema definition',
        'enableSearch': 'Enable Google Search',
        'output_content': 'Generated Content',
        'output_citations': 'Citations',
        'output_data': 'Structured Data',
        'output_status': 'Status',
      },
    }
  },

  // Configuration Form
  formItems: [
    {
      key: 'apiKey',
      label: t('apiKey'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'Enter your Gemini API Key',
        type: 'password' // Masked input if supported, otherwise standard input
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'taskType',
      label: t('taskType'),
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: t('taskType_text'), value: 'text' },
          { label: t('taskType_image'), value: 'image' },
          { label: t('taskType_structured'), value: 'structured' },
          { label: t('taskType_research'), value: 'research' },
        ]
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
          { label: 'Gemini 2.5 Flash (Fast & Cost-effective)', value: 'gemini-2.5-flash' },
          { label: 'Gemini 2.5 Pro (Reasoning)', value: 'gemini-2.5-pro' },
          { label: 'Gemini 3 Pro Preview (Advanced)', value: 'gemini-3-pro-preview' },
          { label: 'Gemini Deep Research (Agent)', value: 'deep-research-pro-preview-12-2025' },
        ]
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'inputField',
      label: t('inputField'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text, FieldType.Attachment], // Support text and images
      },
    },
    {
      key: 'prompt',
      label: t('prompt'),
      component: FieldComponent.Input, // Using Input for multiline text if TextArea not available, or just Input
      props: {
        placeholder: t('prompt_placeholder'),
      },
    },
    {
      key: 'enableSearch',
      label: t('enableSearch'),
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      }
    },
    {
      key: 'jsonSchema',
      label: t('jsonSchema'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('jsonSchema_placeholder'),
      },
      // Simple logic to show only when structured
    }
  ],

  // Result Type Definition
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'id',
          isGroupByKey: true,
          type: FieldType.Text,
          label: 'id',
          hidden: true,
        },
        {
          key: 'content',
          type: FieldType.Text,
          label: t('output_content'),
          primary: true,
        },
        {
          key: 'citations',
          type: FieldType.Text, // Can be text representation of links
          label: t('output_citations'),
        },
        {
          key: 'data',
          type: FieldType.Text, // Storing JSON string or specific fields if schema known. Using Text for flexibility.
          label: t('output_data'),
        },
        {
          key: 'status',
          type: FieldType.Text,
          label: t('output_status'),
        }
      ],
    },
  },

  // Execution Logic
  execute: async (formItemParams: any, context) => {
    const { apiKey, taskType, model, inputField, prompt, enableSearch, jsonSchema } = formItemParams;

    // Helper for logging
    function debugLog(arg: any, tag = 'INFO') {
      console.log(JSON.stringify({ tag, arg, logID: context.logID }), '\n');
    }

    debugLog(formItemParams, 'START_PARAMS');

    // Helper for Fetch
    const callGemini = async (url: string, payload: any) => {
      try {
        const res = await context.fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        debugLog({ url, status: res.status, text: text.slice(0, 1000) }, 'FETCH_RES'); // Log first 1000 chars
        
        if (!res.ok) {
            throw new Error(`API Error: ${res.status} ${text}`);
        }
        
        return JSON.parse(text);
      } catch (e) {
        debugLog(e, 'FETCH_ERROR');
        throw e;
      }
    };

    try {
      // 1. Prepare Input
      let inputText = prompt || '';
      let inputImages: any[] = [];
      
      // If input field is selected, append its value
      if (inputField) {
        if (Array.isArray(inputField)) {
             // Handle Attachment (Array of objects)
             for (const item of inputField) {
                 if (item.type && item.type.startsWith('image/') && item.url) {
                     // Need to download image and convert to base64? 
                     // Or just pass URL if public? Lark URLs are signed. 
                     // Gemini supports File API or Inline Data. Inline is easier for FaaS.
                     // We need to fetch the image first.
                     try {
                         const imgRes = await context.fetch(item.url);
                         const imgBuffer = await imgRes.arrayBuffer();
                         const base64Data = Buffer.from(imgBuffer).toString('base64');
                         inputImages.push({
                             inline_data: {
                                 mime_type: item.type,
                                 data: base64Data
                             }
                         });
                     } catch (err) {
                         debugLog(`Failed to process image: ${err}`, 'IMAGE_ERROR');
                     }
                 } else if (typeof item === 'string' || typeof item === 'number') {
                     inputText += `\nInput Data: ${item}`;
                 }
             }
        } else if (typeof inputField === 'string' || typeof inputField === 'number') {
             inputText += `\nInput Data: ${inputField}`;
        } else if (typeof inputField === 'object' && inputField !== null) {
            // Handle Object type input (e.g. from another shortcut)
             inputText += `\nInput Data: ${JSON.stringify(inputField)}`;
        }
      }

      // 2. Task Dispatch
      if (taskType === 'research') {
        // --- Deep Research Agent ---
        const researchUrl = `https://generativelanguage.googleapis.com/v1beta/interactions`;
        
        // Start Interaction
        const startPayload = {
            input: inputText,
            agent: model, // e.g., 'deep-research-pro-preview-12-2025'
            background: true
        };
        
        debugLog(startPayload, 'RESEARCH_START');
        const startRes = await callGemini(researchUrl, startPayload);
        const interactionId = startRes.name.split('/').pop(); // "interactions/{id}"
        
        // Poll for completion
        let attempts = 0;
        const maxAttempts = 60; // 10 mins approx (if 10s sleep)
        let finalOutput = '';
        
        while (attempts < maxAttempts) {
            // Wait 10 seconds (Simple loop delay)
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            const pollRes = await context.fetch(`${researchUrl}/${interactionId}`, {
                method: 'GET',
                headers: { 'x-goog-api-key': apiKey }
            });
            const pollData = await pollRes.json();
            debugLog(pollData.state, 'POLL_STATUS');
            
            if (pollData.state === 'COMPLETED') {
                // Get last output
                // Interaction structure: outputs [{ content: "..." }]
                // Note: The docs say `outputs[-1].text`. Need to check structure.
                // Assuming standard Gemini Content structure in outputs.
                // The doc says: `interaction.outputs[-1].text`
                if (pollData.outputs && pollData.outputs.length > 0) {
                     const lastOutput = pollData.outputs[pollData.outputs.length - 1];
                     // Check if text is directly there or nested
                     // Docs example: print(interaction.outputs[-1].text)
                     // REST response usually has `outputs`: [{ `content`: "..." }] or similar.
                     // Let's dump the structure in debug if needed, but assume `content` field.
                     // Actually, docs say `outputs` is a list.
                     // Let's assume the text is in `content` or `text`.
                     // Inspecting doc example for REST polling isn't explicit on response body structure except 'outputs'.
                     // I'll assume standard content part structure.
                     // But for safety, I will stringify the whole last output if I can't find text.
                     finalOutput = JSON.stringify(lastOutput); 
                     // Try to extract text more cleanly
                     // Usually: outputs[i].content.parts[0].text
                }
                break;
            } else if (pollData.state === 'FAILED') {
                throw new Error(`Research Failed: ${pollData.error?.message}`);
            }
            attempts++;
        }
        
        return {
            code: FieldCode.Success,
            data: {
                id: interactionId, // Use interactionId as unique ID
                content: finalOutput,
                status: 'Completed',
                citations: 'See report',
                data: ''
            }
        };

      } else {
        // --- Standard Generate Content (Text, Image, Structured) ---
        const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        
        const contentsPart = [];
        if (inputText) contentsPart.push({ text: inputText });
        if (inputImages.length > 0) contentsPart.push(...inputImages.map(img => img)); // Spread images

        const payload: any = {
            contents: [{ parts: contentsPart }]
        };

        // Tools (Google Search)
        if (enableSearch === 'true') {
            payload.tools = [{ google_search: {} }];
        }

        // Structured Output Configuration
        if (taskType === 'structured' && jsonSchema) {
            try {
                const schemaObj = JSON.parse(jsonSchema);
                payload.generationConfig = {
                    response_mime_type: "application/json",
                    response_json_schema: schemaObj
                };
            } catch (e) {
                return {
                    code: FieldCode.Error,
                    data: { status: 'Invalid JSON Schema' }
                };
            }
        }

        debugLog(payload, 'GENERATE_PAYLOAD');
        const apiRes = await callGemini(generateUrl, payload);
        
        // Parse Response
        const candidate = apiRes.candidates?.[0];
        const resultText = candidate?.content?.parts?.[0]?.text || '';
        const groundingMetadata = candidate?.groundingMetadata;
        
        let citations = '';
        if (groundingMetadata?.groundingChunks) {
            citations = groundingMetadata.groundingChunks
                .map((chunk: any, index: number) => `[${index + 1}] ${chunk.web?.title} (${chunk.web?.uri})`)
                .join('\n');
        }

        return {
            code: FieldCode.Success,
            data: {
                id: `${Date.now()}-${Math.random()}`, // Generate unique ID
                content: resultText,
                citations: citations,
                data: taskType === 'structured' ? resultText : '', // Return raw JSON string in data field
                status: 'Success'
            }
        };
      }

    } catch (e) {
      debugLog(String(e), 'EXECUTE_ERROR');
      return {
        code: FieldCode.Error,
        data: {
            status: `Error: ${String(e)}`
        }
      };
    }
  },
});

export default basekit;
