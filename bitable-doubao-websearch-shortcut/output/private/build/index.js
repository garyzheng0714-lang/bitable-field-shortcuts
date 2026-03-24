"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const form_data_1 = __importDefault(require("form-data"));
const { t } = block_basekit_server_api_1.field;
// 添加火山引擎域名白名单
block_basekit_server_api_1.basekit.addDomainList([
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
block_basekit_server_api_1.basekit.addField({
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
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: '非必填，仅当选择“自定义模型”选项时生效',
            },
        },
        {
            key: 'prompt',
            label: t('prompt'),
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text, block_basekit_server_api_1.FieldType.Url, block_basekit_server_api_1.FieldType.Attachment],
            },
        },
        {
            key: 'thinkingMode',
            label: t('thinkingMode'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.Radio,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
            properties: [
                {
                    key: 'groupKey',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: 'id',
                    isGroupByKey: true,
                    hidden: true,
                },
                {
                    key: 'result',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('result'),
                    primary: true,
                },
                {
                    key: 'thinking',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('thinking'),
                },
                {
                    key: 'usage',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('usage'),
                },
                {
                    key: 'cost',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('cost'),
                    extra: {
                        formatter: '0.0000000',
                    },
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数
    execute: async (formItemParams, context) => {
        const { modelType, customModel, apiKey, prefixCacheId, prompt, images, webSearch, thinkingMode } = formItemParams;
        const normalizeValue = (val) => {
            if (val && typeof val === 'object' && 'value' in val)
                return val.value;
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
        function debugLog(arg, showContext = false) {
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
                logID: context?.logID,
                timeZone: context?.timeZone,
                tenantKey: context?.tenantKey,
                baseID: context?.baseID,
                tableID: context?.tableID,
                recordID: context?.recordID,
                packID: context?.packID,
                extensionID: context?.extensionID,
            };
            console.log(JSON.stringify({
                formItemParams: safeFormItemParams,
                context: safeContext,
                arg
            }), '\n');
        }
        debugLog('=====start=====v2.1', true);
        // 封装 fetch 函数
        const fetch = async (url, init, authId) => {
            try {
                const res = await context.fetch(url, init, authId);
                const resText = await res.text();
                let json = undefined;
                try {
                    json = JSON.parse(resText);
                }
                catch {
                    json = undefined;
                }
                const contentType = res.headers?.get?.('content-type') || undefined;
                const headers = init?.headers ? { ...init.headers } : init?.headers;
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
                        status: res?.status,
                        contentType,
                        resText: resText.slice(0, 4000), // 截取日志
                    }
                });
                return {
                    ok: Boolean(res?.ok),
                    status: Number(res?.status ?? 0),
                    contentType,
                    text: resText,
                    json,
                };
            }
            catch (e) {
                const headers = init?.headers ? { ...init.headers } : init?.headers;
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
            const imageInputItems = [];
            const appendImageUrl = (url) => {
                const clean = String(url ?? '').trim();
                if (/^https?:\/\//i.test(clean)) {
                    imageInputItems.push({ type: 'input_image', image_url: clean });
                }
            };
            const appendUrlsFromText = (text) => {
                String(text ?? '')
                    .split(/[,，\n]/)
                    .map(s => s.trim())
                    .filter(Boolean)
                    .forEach(appendImageUrl);
            };
            const extractUrlsFromUnknown = (val) => {
                if (typeof val === 'string') {
                    appendUrlsFromText(val);
                    return;
                }
                if (val && typeof val === 'object') {
                    const candidates = [
                        val.tmp_url,
                        val.tmpUrl,
                        val.download_url,
                        val.downloadUrl,
                        val.preview_url,
                        val.previewUrl,
                        val.link,
                        val.url,
                        val.text,
                    ];
                    candidates.forEach(candidate => {
                        if (typeof candidate === 'string')
                            appendUrlsFromText(candidate);
                    });
                }
            };
            const extractUrlsFromExtra = (extra) => {
                let raw = extra;
                if (typeof raw === 'string') {
                    try {
                        raw = JSON.parse(raw);
                    }
                    catch {
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
                        if (typeof raw[k] === 'string')
                            appendImageUrl(raw[k]);
                    });
                    if (Array.isArray(raw.urls))
                        raw.urls.forEach((u) => typeof u === 'string' && appendImageUrl(u));
                    if (Array.isArray(raw.links))
                        raw.links.forEach((u) => typeof u === 'string' && appendImageUrl(u));
                }
            };
            const getBufferFromRes = async (res) => {
                if (typeof res.buffer === 'function') {
                    return await res.buffer();
                }
                if (typeof res.arrayBuffer === 'function') {
                    const ab = await res.arrayBuffer();
                    return Buffer.from(ab);
                }
                return undefined;
            };
            const downloadAttachmentBuffer = async (attachmentToken) => {
                const token = String(attachmentToken ?? '').trim();
                if (!token)
                    return undefined;
                const urls = [
                    `https://open.feishu.cn/open-apis/drive/v1/medias/${token}/download`,
                    `https://open.larksuite.com/open-apis/drive/v1/medias/${token}/download`,
                ];
                for (const url of urls) {
                    try {
                        const res = await context.fetch(url, { method: 'GET' });
                        if (!res.ok)
                            continue;
                        const buf = await getBufferFromRes(res);
                        if (buf && buf.length > 0)
                            return buf;
                    }
                    catch {
                    }
                }
                return undefined;
            };
            const downloadByUrlBuffer = async (url) => {
                const u = String(url ?? '').trim();
                if (!/^https?:\/\//i.test(u))
                    return { status: 0 };
                try {
                    const referer = (() => {
                        try {
                            return new URL(u).origin + '/';
                        }
                        catch {
                            return undefined;
                        }
                    })();
                    const res = await context.fetch(u, {
                        method: 'GET',
                        headers: {
                            'User-Agent': 'Mozilla/5.0',
                            Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                            ...(referer ? { Referer: referer } : {}),
                        },
                    });
                    if (!res.ok)
                        return { status: res.status };
                    const contentType = res.headers?.get?.('content-type') || undefined;
                    const buf = await getBufferFromRes(res);
                    if (buf && buf.length > 0)
                        return { status: res.status, buf: buf, contentType };
                }
                catch {
                }
                return { status: 0 };
            };
            const formatArkErrorMessage = (payload, status) => {
                const err = payload?.error ?? payload;
                const code = err?.code ?? err?.type;
                const message = err?.message ?? err?.error?.message ?? '';
                const normalized = String([code, message].filter(Boolean).join(': ')).trim();
                const lower = normalized.toLowerCase();
                const isAuth = status === 401 ||
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
            const uploadBufferToArk = async (fileBuffer, filename, mimeType) => {
                const form = new form_data_1.default();
                form.append('purpose', 'user_data');
                form.append('file', fileBuffer, {
                    filename: filename || 'image',
                    contentType: mimeType || 'application/octet-stream',
                });
                const res = await context.fetch('https://ark.cn-beijing.volces.com/api/v3/files', {
                    method: 'POST',
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${effectiveApiKey}`,
                    },
                    body: form,
                });
                const text = await res.text();
                let json;
                try {
                    json = JSON.parse(text);
                }
                catch {
                    json = undefined;
                }
                const fileId = json?.id ?? json?.data?.id ?? json?.file?.id;
                if (!res.ok || !fileId) {
                    const errMsg = formatArkErrorMessage(json, res.status);
                    if (errMsg.startsWith('API Key'))
                        throw new Error(errMsg);
                    throw new Error(`上传图片失败：${errMsg || text.slice(0, 2000)}`);
                }
                return String(fileId);
            };
            if (images) {
                if (Array.isArray(images) &&
                    images.length > 0 &&
                    images.some((item) => {
                        if (!item || typeof item !== 'object')
                            return false;
                        if ('attachmentToken' in item)
                            return true;
                        if ('tmp_url' in item || 'tmpUrl' in item)
                            return true;
                        if ('download_url' in item || 'downloadUrl' in item)
                            return true;
                        if ('preview_url' in item || 'previewUrl' in item)
                            return true;
                        return false;
                    })) {
                    const beforeTotal = imageInputItems.length;
                    const attachmentImageCount = images.filter(item => {
                        if (!item || typeof item !== 'object')
                            return false;
                        const mimeType = item.mimeType ?? item.type;
                        if (mimeType && !String(mimeType).startsWith('image/'))
                            return false;
                        return Boolean(item.attachmentToken ||
                            item.tmp_url ||
                            item.tmpUrl ||
                            item.download_url ||
                            item.downloadUrl ||
                            item.preview_url ||
                            item.previewUrl);
                    }).length;
                    for (const item of images) {
                        if (imageInputItems.length >= 10)
                            break;
                        if (!item || typeof item !== 'object')
                            continue;
                        const mimeType = item.mimeType ?? item.type;
                        if (mimeType && !String(mimeType).startsWith('image/'))
                            continue;
                        const directUrl = item.tmp_url ||
                            item.tmpUrl ||
                            item.download_url ||
                            item.downloadUrl ||
                            item.preview_url ||
                            item.previewUrl ||
                            item.url ||
                            item.link;
                        if (directUrl) {
                            const { buf } = await downloadByUrlBuffer(String(directUrl));
                            if (buf) {
                                const fileId = await uploadBufferToArk(buf, String(item.name ?? 'image'), mimeType);
                                imageInputItems.push({ type: 'input_image', file_id: fileId });
                                continue;
                            }
                        }
                        const beforeCount = imageInputItems.length;
                        extractUrlsFromExtra(item.extra);
                        if (imageInputItems.length >= 10)
                            break;
                        if (imageInputItems.length > beforeCount)
                            continue;
                        const attachmentToken = item.attachmentToken;
                        if (attachmentToken) {
                            const buf = await downloadAttachmentBuffer(String(attachmentToken));
                            if (!buf)
                                continue;
                            const fileId = await uploadBufferToArk(buf, String(item.name ?? 'image'), mimeType);
                            imageInputItems.push({ type: 'input_image', file_id: fileId });
                        }
                    }
                    if (attachmentImageCount > 0 && imageInputItems.length === beforeTotal) {
                        throw new Error('图片附件解析失败：请确认附件为图片且当前有权限下载该附件');
                    }
                }
                else if (Array.isArray(images)) {
                    images.forEach(v => extractUrlsFromUnknown(v));
                }
                else {
                    extractUrlsFromUnknown(images);
                }
            }
            const resolveImageInputItems = async (items) => {
                const resolved = [];
                const hasImageUrl = items.some(it => it && typeof it === 'object' && typeof it.image_url === 'string');
                const urlItems = items.filter(it => it && typeof it === 'object' && typeof it.image_url === 'string');
                const urlToFilename = (url) => {
                    try {
                        const u = new URL(url);
                        const last = u.pathname.split('/').filter(Boolean).pop();
                        return last || 'image';
                    }
                    catch {
                        return 'image';
                    }
                };
                for (const it of items) {
                    if (resolved.length >= 10)
                        break;
                    if (it && typeof it === 'object' && it.file_id) {
                        resolved.push(it);
                        continue;
                    }
                    const url = it && typeof it === 'object' ? it.image_url : undefined;
                    if (typeof url !== 'string')
                        continue;
                    const { buf, contentType } = await downloadByUrlBuffer(url);
                    if (!buf)
                        continue;
                    const fileId = await uploadBufferToArk(buf, urlToFilename(url), contentType);
                    resolved.push({ type: 'input_image', file_id: fileId });
                }
                if (hasImageUrl && resolved.length === 0) {
                    const fallback = urlItems.slice(0, 10).map(it => ({ type: 'input_image', image_url: it.image_url }));
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
            let input;
            const shouldUseWebSearch = normalizedWebSearch === 'true' || normalizedWebSearch === true;
            const shouldUseWebSearchTool = shouldUseWebSearch;
            if (resolvedImageItems.length > 0) {
                const content = [...resolvedImageItems.slice(0, 10)];
                content.push({ type: 'input_text', text: String(normalizedPrompt ?? '') });
                input = [{ role: 'user', content }];
            }
            else if (shouldUseWebSearchTool) {
                input = [
                    {
                        role: 'user',
                        content: String(normalizedPrompt ?? ''),
                    },
                ];
            }
            else {
                // 纯文本
                input = String(normalizedPrompt ?? '');
            }
            const finalModel = normalizedModelType === 'custom'
                ? String(normalizedCustomModel ?? '').trim()
                : String(normalizedModelType ?? '').trim();
            if (!finalModel) {
                throw new Error('model 不能为空：请选择模型或填写自定义模型名称');
            }
            const requestBody = {
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
            }
            else if (normalizedThinkingMode === 'disable') {
                requestBody.thinking = { type: 'disabled' };
            }
            // 'auto' 模式不传递 thinking 参数，使用默认行为
            const isThinkingMismatchWithCachedHead = (message) => /thinking type is not consistent with head cached response/i.test(String(message || ''));
            const doRequest = async (body) => {
                const baseHeaders = {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization: `Bearer ${effectiveApiKey}`,
                };
                // FaaS 线上环境要求直接传递对象作为 body，由运行时负责 JSON 序列化
                // 如果传递字符串，FaaS 运行时可能会错误地预处理导致请求体格式异常
                // 表现为：err:readObjectStart: expect { or n, but found , error found in #0 byte
                const res = await fetch(apiUrl, {
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
            const buildBodyWithThinking = (mode) => {
                const body = { ...requestBody };
                if (mode === 'omit') {
                    delete body.thinking;
                    return body;
                }
                body.thinking = { type: mode === 'enable' ? 'enabled' : 'disabled' };
                return body;
            };
            const thinkingCandidates = normalizedThinkingMode === 'enable'
                ? ['enable', 'disable']
                : normalizedThinkingMode === 'disable'
                    ? ['disable', 'enable']
                    : ['omit', 'disable', 'enable'];
            // 3. 发起请求（若复用缓存且 thinking 不一致，自动重试对齐）
            let res;
            let lastError;
            for (const mode of thinkingCandidates) {
                try {
                    res = await doRequest(buildBodyWithThinking(mode));
                    lastError = undefined;
                    break;
                }
                catch (e) {
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
            }
            else if (Array.isArray(res?.output) && res.output.length > 0) {
                const outputs = res.output;
                const messageOutput = outputs.find((o) => o?.type === 'message' && o?.role === 'assistant') || outputs.find((o) => o?.type === 'message');
                const reasoningOutput = outputs.find((o) => o?.type === 'reasoning');
                if (reasoningOutput?.summary && Array.isArray(reasoningOutput.summary)) {
                    thinkingText = reasoningOutput.summary.map((s) => s?.text || '').join('\n');
                }
                const messageContent = messageOutput?.content ?? messageOutput?.message?.content;
                if (typeof messageContent === 'string') {
                    resultText = messageContent;
                }
                else if (Array.isArray(messageContent)) {
                    resultText = messageContent.map((p) => p?.text || '').join('');
                }
                usageInfo = {
                    input_tokens: Number(res?.usage?.input_tokens ?? 0),
                    output_tokens: Number(res?.usage?.output_tokens ?? 0),
                    cached_tokens: Number(res?.usage?.input_tokens_details?.cached_tokens ?? 0),
                };
            }
            // 5. 计算费用
            const normalizeModelToPricingKey = (model) => {
                const m = String(model || '').trim();
                if (/^doubao-seed-1-8/i.test(m))
                    return 'doubao-seed-1.8';
                if (/^doubao-seed-1-6-thinking/i.test(m))
                    return 'doubao-seed-1.6-thinking';
                if (/^doubao-seed-1-6-flash/i.test(m))
                    return 'doubao-seed-1.6-flash';
                if (/^doubao-seed-1-6-lite/i.test(m))
                    return 'doubao-seed-1.6-lite';
                if (/^doubao-seed-1-6-vision/i.test(m))
                    return 'doubao-seed-1.6-vision';
                if (/^doubao-seed-1-6(?!-(thinking|flash|lite|vision))/i.test(m))
                    return 'doubao-seed-1.6';
                return 'unknown';
            };
            const pickPricingTier = (inputTokens) => {
                const t = Number(inputTokens || 0);
                if (t <= 32000)
                    return 0;
                if (t <= 128000)
                    return 1;
                return 2;
            };
            const pricingTable = {
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
            const groupKey = String(context?.recordID || context?.logID || Date.now());
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
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
            };
        }
        catch (e) {
            console.log('====error', String(e));
            debugLog({
                '===999 异常错误': String(e)
            });
            const errMsg = e instanceof Error ? e.message : String(e);
            const groupKey = String(context?.recordID || context?.logID || Date.now());
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    groupKey,
                    result: `Error: ${errMsg}`,
                    thinking: '',
                    usage: '',
                    cost: 0,
                }
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtRkFBK0g7QUFDL0gsMERBQWlDO0FBQ2pDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLGNBQWM7QUFDZCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQztJQUNwQiwyQkFBMkI7SUFDM0IsZ0JBQWdCO0lBQ2hCLG9CQUFvQjtJQUNwQixxQ0FBcUM7SUFDckMseUNBQXlDO0lBQ3pDLGdCQUFnQjtJQUNoQixxQkFBcUI7SUFDckIsMEJBQTBCO0lBQzFCLGlDQUFpQztJQUNqQyw0QkFBNEI7SUFDNUIsa0RBQWtEO0lBQ2xELGdCQUFnQjtJQUNoQix1QkFBdUI7SUFDdkIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2Ysd0JBQXdCO0lBQ3hCLGFBQWE7SUFDYix5QkFBeUI7SUFDekIsbUJBQW1CO0lBQ25CLGlCQUFpQjtJQUNqQixvQkFBb0I7SUFDcEIsYUFBYTtJQUNiLFdBQVc7SUFDWCxVQUFVO0lBQ1YsUUFBUTtJQUNSLGNBQWM7SUFDZCxZQUFZO0lBQ1osMkJBQTJCO0lBQzNCLG1DQUFtQztJQUNuQyxxQkFBcUI7SUFDckIsbUJBQW1CO0lBQ25CLGNBQWM7SUFDZCxlQUFlO0lBQ2YsMkJBQTJCO0lBQzNCLDJCQUEyQjtJQUMzQiwyQkFBMkI7SUFDM0IsMkJBQTJCO0lBQzNCLFdBQVc7SUFDWCxpQkFBaUI7SUFDakIsMEJBQTBCO0lBQzFCLG9CQUFvQjtJQUNwQixzQkFBc0I7Q0FDdkIsQ0FBQyxDQUFDO0FBRUgsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixnQkFBZ0I7SUFDaEIsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixhQUFhLEVBQUUsU0FBUztnQkFDeEIsUUFBUSxFQUFF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