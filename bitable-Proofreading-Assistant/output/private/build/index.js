"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 允许请求的域名白名单
block_basekit_server_api_1.basekit.addDomainList(['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com', 'open.feishu.cn']);
// ========== 文本清理：去除 Markdown/HTML/多余空白，保留纯文本 ==========
function sanitizeMarkdownPlain(input) {
    if (!input)
        return '';
    let text = String(input).replace(/\r\n?/g, '\n');
    // 去掉围栏代码围栏，保留内容
    text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, '').trim());
    // 行内代码 `code` -> code
    text = text.replace(/`([^`]+)`/g, '$1');
    // 图片 ![alt](url) -> alt
    text = text.replace(/!\[([^\]]*)\]\((?:[^)]+)\)/g, '$1');
    // 链接 [text](url) -> text
    text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1');
    // 标题符号 #
    text = text.replace(/^(?:\s{0,3}#{1,6}\s+)(.*)$/gm, '$1');
    // 引用 >
    text = text.replace(/^\s{0,3}>\s?(.*)$/gm, '$1');
    // 列表符号 -*+ 以及 1.
    text = text.replace(/^\s*[-*+]\s+(.*)$/gm, '$1');
    // 保留有序列表的数字编号，不再去除 1. 2. 等
    // text = text.replace(/^\s*\d+\.\s+(.*)$/gm, '$1');
    // 表格竖线与分隔
    text = text.replace(/^\s*\|/gm, '');
    text = text.replace(/\|/g, ' ');
    text = text.replace(/^\s*[-|:]+\s*$/gm, '');
    // 强调、删除线符号
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    text = text.replace(/~~(.*?)~~/g, '$1');
    // 水平线
    text = text.replace(/^\s*([-*_]\s*){3,}$/gm, '');
    // 反斜杠转义
    text = text.replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, '$1');
    // 去除 HTML 标签
    text = text.replace(/<[^>]+>/g, '');
    // 空白规范化
    text = text.replace(/\u00A0/g, ' ');
    text = text.replace(/[\t ]+/g, ' ');
    text = text.replace(/\s*\n\s*/g, '\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
}
// ========== 修改说明兜底（简化版） ==========
function buildChangeNotesPlain(original, corrected) {
    const a = sanitizeMarkdownPlain(original || '');
    const b = sanitizeMarkdownPlain(corrected || '');
    if (a === b)
        return '未检测到需要修改的内容';
    const delta = Math.abs(b.length - a.length);
    const before = a.slice(0, 60) + (a.length > 60 ? '…' : '');
    const after = b.slice(0, 60) + (b.length > 60 ? '…' : '');
    return `做了必要的ncorrectedContent与润色，提升用词准确性与语句流畅度。\n变更量(按长度估算): ${delta}\n示例:\n${before} -> ${after}`;
}
// ========== 兼容多种服务端出参（字段名可能变化） ==========
function getByPath(obj, path) {
    if (!obj || typeof obj !== 'object')
        return undefined;
    const segs = path.split('.');
    let cur = obj;
    for (const s of segs) {
        if (cur && typeof cur === 'object' && s in cur) {
            cur = cur[s];
        }
        else if (/^\d+$/.test(s) && Array.isArray(cur)) {
            cur = cur[Number(s)];
        }
        else {
            return undefined;
        }
    }
    return cur;
}
function deepFindByKeyIncludes(obj, aliases) {
    try {
        const queue = [obj];
        const aliasSet = aliases.map(a => a.toLowerCase());
        while (queue.length) {
            const cur = queue.shift();
            if (cur && typeof cur === 'object') {
                for (const [k, v] of Object.entries(cur)) {
                    if (typeof v === 'string') {
                        const kl = k.toLowerCase();
                        if (aliasSet.some(a => kl.includes(a)) && v.trim())
                            return v;
                    }
                    else if (v && typeof v === 'object') {
                        queue.push(v);
                    }
                }
            }
        }
    }
    catch { }
    return undefined;
}
function extractCorrectedText(resObj, fallback) {
    const pathAliases = [
        // 常见直达路径
        'AI', 'corrected', 'correctedText', 'modified', 'text', 'content',
        'data.AI', 'data.corrected', 'data.correctedText', 'data.modified', 'data.text', 'data.content',
        'choices.0.message.content', 'result.text', 'result.content'
    ];
    for (const p of pathAliases) {
        const val = getByPath(resObj, p);
        if (typeof val === 'string' && val.trim())
            return val;
    }
    // 退化为按键名模糊匹配
    const deep = deepFindByKeyIncludes(resObj, ['ai', 'correct', 'modif', 'revise', 'final', 'text', 'content', 'message']);
    if (typeof deep === 'string' && deep.trim())
        return deep;
    return typeof fallback === 'string' ? fallback : JSON.stringify(fallback ?? '');
}
function extractChangeNotes(resObj) {
    const pathAliases = [
        'explain', 'explanation', 'reason', 'analysis', 'changeNotes', 'changes', 'diff', 'comment',
        'data.explain', 'data.explanation', 'data.reason', 'data.analysis', 'data.changeNotes', 'data.changes', 'data.diff'
    ];
    for (const p of pathAliases) {
        const val = getByPath(resObj, p);
        if (typeof val === 'string' && val.trim())
            return val;
    }
    const deep = deepFindByKeyIncludes(resObj, ['explain', 'reason', 'analysis', 'change', 'diff', 'comment']);
    if (typeof deep === 'string' && deep.trim())
        return deep;
    return undefined;
}
// ========== 字段捷径：返回包含两个值的对象 ==========
block_basekit_server_api_1.basekit.addField({
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            'zh-CN': {
                'inputText': '待纠错文本',
                'correctedContent': '修改后的内容',
                'changeNotes': '修改说明',
            },
            'en-US': {
                'inputText': 'Text to Correct',
                'correctedContent': 'Corrected Content',
                'changeNotes': 'Change Notes',
            },
            'ja-JP': {
                'inputText': '校正するテキスト',
                'correctedContent': '修正後の内容',
                'changeNotes': '修正の説明',
            },
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            key: 'inputText',
            label: t('inputText'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '请输入需要纠错的文本',
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'model',
            label: 'AI模型选择',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                placeholder: '请选择AI模型',
                options: [
                    { label: 'DeepSeek-V3', value: 'deepseek-v3' },
                    { label: 'Doubao-Seed-1.6', value: 'doubao-seed-1.6' },
                    { label: 'Doubao-1.5-pro-32k', value: 'doubao-1.5-pro-32k' },
                    { label: '其他模型', value: 'custom' }
                ]
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'customModel',
            label: '其他模型的名称',
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '仅在模型选择其他模型时生效',
            }
        },
    ],
    // 定义捷径的返回结果类型 - 对象类型，包含两个字段
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'data:image/svg+xml;utf8,<svg t="1757255371543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6258" width="256" height="256"><path d="M763.744 240.576l-67.84-67.904-317.76 317.76-10.784 78.624 78.656-10.752z" fill="%233671FD" opacity=".2" p-id="6259"></path><path d="M787.904 198.976a64 64 0 0 1 0 90.496l-302.592 302.624a64 64 0 0 1-36.576 18.144l-115.2 15.776A16 16 0 0 1 315.52 608l15.776-115.2a64 64 0 0 1 18.144-36.576l302.624-302.592a64 64 0 0 1 90.496 0z m-45.248 45.152l-45.248-45.248-302.624 302.592-7.168 52.48 52.448-7.2z" fill="%233671FD" p-id="6260"></path><path d="M416.512 154.432a32 32 0 0 1 3.744 63.776l-3.744 0.224h-160a64 64 0 0 0-63.84 59.2l-0.16 4.8v480a64 64 0 0 0 59.2 63.84l4.8 0.16h512a64 64 0 0 0 63.84-59.2l0.16-4.8v-288a32 32 0 0 1 63.776-3.744l0.224 3.744v288a128 128 0 0 1-121.6 127.84l-6.4 0.16h-512a128 128 0 0 1-127.84-121.6l-0.16-6.4v-480a128 128 0 0 1 121.6-127.84l6.4-0.16z" fill="%233671FD" p-id="6261"></path><path d="M320.512 666.432h384a28.288 28.288 0 0 1 32 32 28.288 28.288 0 0 1-32 32h-384a28.288 28.288 0 0 1-32-32 28.288 28.288 0 0 1 32-32z" fill="%23FE9C23" p-id="6262"></path></svg>'
            },
            properties: [
                {
                    key: 'correctedContent',
                    label: t('correctedContent'),
                    type: block_basekit_server_api_1.FieldType.Text,
                    isGroupByKey: true,
                    primary: true
                },
                {
                    key: 'changeNotes',
                    label: t('changeNotes'),
                    type: block_basekit_server_api_1.FieldType.Text
                },
                {
                    key: 'modelUsed',
                    label: '使用的模型',
                    type: block_basekit_server_api_1.FieldType.Text
                }
            ]
        }
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems
    execute: async (formItemParams, context) => {
        const { inputText = '', model, customModel } = formItemParams;
        // 处理模型选择逻辑：单选优先级最高，只有选择'其他模型'时才使用自定义模型名称
        let selectedModel = 'default';
        if (model?.value) {
            if (model.value === 'custom' && customModel?.trim()) {
                // 自定义模型：使用用户输入，保持用户大小写
                selectedModel = customModel.trim();
            }
            else if (model.value !== 'custom') {
                // 内置模型：与单选显示一致，优先使用 label（与 UI 文案完全一致）
                selectedModel = model.label || model.value;
            }
        }
        console.log('Selected model:', selectedModel);
        // 清理输入文本
        const oClean = sanitizeMarkdownPlain(inputText);
        if (!oClean) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    correctedContent: '',
                    changeNotes: '输入文本为空'
                }
            };
        }
        try {
            // 调用飞书工具流接口进行文本纠错
            const requestUrl = 'https://open.feishu.cn/anycross/trigger/callback/MmMxMGIxZDJmMTMyYzdiMzBkNjcyNTRlZjc1YjA5MTUw' +
                '?message=' + encodeURIComponent(inputText) +
                '&model=' + encodeURIComponent(selectedModel);
            console.log('Request URL:', requestUrl);
            const resText = await context.fetch(requestUrl, {
                method: 'GET',
            }).then((r) => r.text());
            // 检查是否是HTML错误页面（如504错误）
            if (resText.trim().startsWith('<!DOCTYPE') || resText.trim().startsWith('<html')) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        correctedContent: oClean,
                        changeNotes: '接口暂时不可用，返回原文'
                    }
                };
            }
            let resObj;
            try {
                resObj = JSON.parse(resText);
            }
            catch { }
            // 提取纠错后的内容
            const correctedRaw = resObj ? extractCorrectedText(resObj, resText) : resText;
            const correctedClean = sanitizeMarkdownPlain(correctedRaw);
            // 提取修改说明
            const serverNotesRaw = resObj ? extractChangeNotes(resObj) : undefined;
            const notes = serverNotesRaw
                ? sanitizeMarkdownPlain(serverNotesRaw)
                : buildChangeNotesPlain(oClean, correctedClean);
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    correctedContent: correctedClean,
                    changeNotes: notes,
                    modelUsed: selectedModel
                }
            };
        }
        catch (e) {
            // 发生异常时避免在单元格报错，直接返回清理后的原文
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    correctedContent: oClean,
                    changeNotes: '处理过程中发生异常，返回原文',
                    modelUsed: selectedModel
                }
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNEc7QUFDNUcsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsYUFBYTtBQUNiLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBRTdHLHlEQUF5RDtBQUN6RCxTQUFTLHFCQUFxQixDQUFDLEtBQWE7SUFDMUMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLEVBQUUsQ0FBQztJQUN0QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxnQkFBZ0I7SUFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUUsc0JBQXNCO0lBQ3RCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4Qyx3QkFBd0I7SUFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekQseUJBQXlCO0lBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hELFNBQVM7SUFDVCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxRCxPQUFPO0lBQ1AsSUFB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