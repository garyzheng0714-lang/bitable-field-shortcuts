"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// Add allowed domains for Gemini API
block_basekit_server_api_1.basekit.addDomainList(['generativelanguage.googleapis.com', 'feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com']);
block_basekit_server_api_1.basekit.addField({
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text, block_basekit_server_api_1.FieldType.Attachment], // Support text and images
            },
        },
        {
            key: 'prompt',
            label: t('prompt'),
            component: block_basekit_server_api_1.FieldComponent.Input, // Using Input for multiline text if TextArea not available, or just Input
            props: {
                placeholder: t('prompt_placeholder'),
            },
        },
        {
            key: 'enableSearch',
            label: t('enableSearch'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: t('jsonSchema_placeholder'),
            },
            // Simple logic to show only when structured
        }
    ],
    // Result Type Definition
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
            properties: [
                {
                    key: 'id',
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: 'id',
                    hidden: true,
                },
                {
                    key: 'content',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('output_content'),
                    primary: true,
                },
                {
                    key: 'citations',
                    type: block_basekit_server_api_1.FieldType.Text, // Can be text representation of links
                    label: t('output_citations'),
                },
                {
                    key: 'data',
                    type: block_basekit_server_api_1.FieldType.Text, // Storing JSON string or specific fields if schema known. Using Text for flexibility.
                    label: t('output_data'),
                },
                {
                    key: 'status',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('output_status'),
                }
            ],
        },
    },
    // Execution Logic
    execute: async (formItemParams, context) => {
        const { apiKey, taskType, model, inputField, prompt, enableSearch, jsonSchema } = formItemParams;
        // Helper for logging
        function debugLog(arg, tag = 'INFO') {
            console.log(JSON.stringify({ tag, arg, logID: context.logID }), '\n');
        }
        debugLog(formItemParams, 'START_PARAMS');
        // Helper for Fetch
        const callGemini = async (url, payload) => {
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
            }
            catch (e) {
                debugLog(e, 'FETCH_ERROR');
                throw e;
            }
        };
        try {
            // 1. Prepare Input
            let inputText = prompt || '';
            let inputImages = [];
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
                            }
                            catch (err) {
                                debugLog(`Failed to process image: ${err}`, 'IMAGE_ERROR');
                            }
                        }
                        else if (typeof item === 'string' || typeof item === 'number') {
                            inputText += `\nInput Data: ${item}`;
                        }
                    }
                }
                else if (typeof inputField === 'string' || typeof inputField === 'number') {
                    inputText += `\nInput Data: ${inputField}`;
                }
                else if (typeof inputField === 'object' && inputField !== null) {
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
                    }
                    else if (pollData.state === 'FAILED') {
                        throw new Error(`Research Failed: ${pollData.error?.message}`);
                    }
                    attempts++;
                }
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        id: interactionId, // Use interactionId as unique ID
                        content: finalOutput,
                        status: 'Completed',
                        citations: 'See report',
                        data: ''
                    }
                };
            }
            else {
                // --- Standard Generate Content (Text, Image, Structured) ---
                const generateUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
                const contentsPart = [];
                if (inputText)
                    contentsPart.push({ text: inputText });
                if (inputImages.length > 0)
                    contentsPart.push(...inputImages.map(img => img)); // Spread images
                const payload = {
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
                    }
                    catch (e) {
                        return {
                            code: block_basekit_server_api_1.FieldCode.Error,
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
                        .map((chunk, index) => `[${index + 1}] ${chunk.web?.title} (${chunk.web?.uri})`)
                        .join('\n');
                }
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        id: `${Date.now()}-${Math.random()}`, // Generate unique ID
                        content: resultText,
                        citations: citations,
                        data: taskType === 'structured' ? resultText : '', // Return raw JSON string in data field
                        status: 'Success'
                    }
                };
            }
        }
        catch (e) {
            debugLog(String(e), 'EXECUTE_ERROR');
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                data: {
                    status: `Error: ${String(e)}`
                }
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNEc7QUFFNUcsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIscUNBQXFDO0FBQ3JDLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsbUNBQW1DLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBRWhJLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsaUJBQWlCO0lBQ2pCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxVQUFVLEVBQUUsTUFBTTtnQkFDbEIsZUFBZSxFQUFFLE1BQU07Z0JBQ3ZCLGdCQUFnQixFQUFFLE1BQU07Z0JBQ3hCLHFCQUFxQixFQUFFLE9BQU87Z0JBQzlCLG1CQUFtQixFQUFFLHNCQUFzQjtnQkFDM0MsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFFBQVEsRUFBRSxjQUFjO2dCQUN4QixvQkFBb0IsRUFBRSxrQkFBa0I7Z0JBQ3hDLFlBQVksRUFBRSxzQkFBc0I7Z0JBQ3BDLHdCQUF3QixFQUFFLG9CQUFvQjtnQkFDOUMsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLGdCQUFnQixFQUFFLE1BQU07Z0JBQ3hCLGtCQUFrQixFQUFFLE1BQU07Z0JBQzFCLGFBQWEsRUFBRSxPQUFPO2dCQUN0QixlQUFlLEVBQUUsSUFBSTthQUN0QjtZQUNELE9BQU8sRUFBRTtnQkFDUCxVQUFVLEVBQUUsV0FBVztnQkFDdkIsZUFBZSxFQUFFLGlCQUFpQjtnQkFDbEMsZ0JBQWdCLEVBQUUscUJBQXFCO2dCQUN2QyxxQkFBcUIsRUFBRSxtQkFBbUI7Z0JBQzFDLG1CQUFtQixFQUFFLHFCQUFxQjtnQkFD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