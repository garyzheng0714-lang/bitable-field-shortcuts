"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const crypto_js_1 = __importDefault(require("crypto-js"));
const { t } = block_basekit_server_api_1.field;
const DEFAULT_API_KEY = 'CL004dcea92bbbd8eb';
const DEFAULT_API_SECRET = '265fe6b999409d28d052bb255e0c518d';
const DEFAULT_API_SECRET_ENV_KEY = 'CLI_LABEL_API_SECRET';
const CONFIG = {
    WHITELIST: [
        'feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com',
        'open.feishu.cn',
        'open-api.cli.im', 'cli.im',
        'quickchart.io',
        'tos-cn-beijing.volces.com',
        'feishu-base.tos-cn-beijing.volces.com',
        'wsrv.nl', 'images.weserv.nl'
    ]
};
block_basekit_server_api_1.basekit.addDomainList(CONFIG.WHITELIST);
const Logic = {
    parseExtraParams(input) {
        const text = String(input || '').trim();
        if (!text)
            return {};
        const parsed = {};
        const searchParams = new URLSearchParams(text);
        for (const [key, value] of Array.from(searchParams.entries())) {
            const k = String(key || '').trim();
            if (!k)
                continue;
            if (k === 'api_key' || k === 'cliT' || k === 'cliD' || k === 'sign')
                continue;
            parsed[k] = String(value ?? '');
        }
        return parsed;
    },
    generateApiUrl(params) {
        const { apiKey, cliT, cliD, cliP1, extraParams, apiSecret } = params;
        const queryParams = {
            api_key: apiKey,
            cliT,
            cliD,
        };
        if (extraParams) {
            Object.keys(extraParams).forEach((key) => {
                queryParams[key] = String(extraParams[key] ?? '');
            });
        }
        if (cliP1) {
            queryParams.cliP1 = cliP1;
        }
        let sign = '';
        if (apiSecret) {
            const sortedKeys = Object.keys(queryParams).sort();
            const baseString = sortedKeys.map((key) => `${key}=${queryParams[key]}`).join('&') + apiSecret;
            sign = crypto_js_1.default.MD5(baseString).toString();
        }
        const query = [];
        Object.keys(queryParams).forEach((key) => {
            const value = queryParams[key];
            query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
        if (sign) {
            query.push(`sign=${encodeURIComponent(sign)}`);
        }
        return `https://open-api.cli.im/cli-open-platform-service/v1/labelStyle/createWithKey?${query.join('&')}`;
    },
};
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh-CN': { 'styleId': '选择二维码样式', 'customStyleId': '自定义样式编号', 'content': '二维码内容（链接/文本）', 'qrCode': '二维码' },
            'en-US': { 'styleId': 'Select QR Style', 'customStyleId': 'Custom Style ID', 'content': 'QR Content (Link/Text)', 'qrCode': 'QR Code' },
            'ja-JP': { 'styleId': 'QRスタイルを選択', 'customStyleId': 'カスタムスタイルID', 'content': 'QRコードの内容（リンク/テキスト）', 'qrCode': 'QRコード' },
        }
    },
    formItems: [
        {
            key: 'styleSelect',
            label: t('styleId'),
            tooltips: [
                {
                    type: 'link',
                    text: '点此查看二维码样式示例图',
                    link: 'https://foodtalks.feishu.cn/share/base/view/shrcnl4CMjGKpIWhA2ujlK9CoQg'
                }
            ],
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '标准样式（无Logo）', value: 'D26' },
                    { label: 'D10-FBIF-白底Logo', value: 'D10' },
                    { label: 'D11-FBIF-深蓝底Logo', value: 'D11' },
                    { label: 'D12-FBIF-蓝底Logo', value: 'D12' },
                    { label: 'D13-FBIF-深度•创新', value: 'D13' },
                    { label: 'D14-FBIF-食品创新展（字体）', value: 'D14' },
                    { label: 'D15-FBIF-展览（字体）', value: 'D15' },
                    { label: 'D16-FBIF-食品创新展（双语字体）', value: 'D16' },
                    { label: 'D17-FBIF-FBIF EXPO', value: 'D17' },
                    { label: 'D18-Simba-白底Logo', value: 'D18' },
                    { label: 'D19-Simba-蓝底Logo', value: 'D19' },
                    { label: 'D20-FoodTalks媒体-白字蓝底Logo', value: 'D20' },
                    { label: 'D21-FoodTalks媒体-蓝字白底logo', value: 'D21' },
                    { label: 'D22-WOW FOOD-方形黑底Logo', value: 'D22' },
                    { label: 'D23-WOW FOOD-方形黄底Logo', value: 'D23' },
                    { label: 'D24-食品雷达-方形蓝底Logo', value: 'D24' },
                    { label: 'D25-渠道组-Wow Food 爆品超市蓝底', value: 'D25' },
                    { label: '其他自定义标签样式', value: 'custom' }
                ]
            },
            validator: { required: true }
        },
        {
            key: 'customStyleId',
            label: t('customStyleId'),
            tooltips: [
                {
                    type: 'link',
                    text: '如何自定义二维码样式？',
                    link: 'https://foodtalks.feishu.cn/docx/F1k3d8K5so220hx1AMCcIyounre'
                }
            ],
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: { placeholder: '非必填，仅当上方选择“其他自定义标签样式”时生效' },
            validator: { required: false }
        },
        {
            key: 'cliD',
            label: t('content'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: { placeholder: '请输入扫描二维码后展示的内容（如网页链接或文本）' },
            validator: { required: true }
        },
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
    execute: async (formItemParams, context) => {
        const env = process?.env ?? {};
        const apiKey = DEFAULT_API_KEY;
        const apiSecret = DEFAULT_API_SECRET;
        // 获取样式ID：如果是自定义，则取 customStyleId，否则取选项值
        let cliT = formItemParams.styleSelect?.value;
        if (cliT === 'custom') {
            cliT = String(formItemParams.customStyleId || '').trim();
        }
        const { cliD } = formItemParams;
        const log = (msg, data) => {
            let safeData = undefined;
            if (data !== undefined && data !== null) {
                if (typeof data === 'string') {
                    safeData = data;
                }
                else {
                    try {
                        safeData = JSON.stringify(data);
                    }
                    catch {
                        safeData = String(data);
                    }
                }
            }
            console.log(JSON.stringify({
                logID: context.logID,
                msg,
                data: safeData ? safeData.substring(0, 200) : undefined
            }));
        };
        log('Start Execution', { cliT, cliD });
        try {
            const parsedExtraParams = Logic.parseExtraParams('');
            const apiUrl = Logic.generateApiUrl({ apiKey, cliT, cliD, cliP1: undefined, extraParams: parsedExtraParams, apiSecret: apiSecret || undefined });
            // 3. 使用图片代理 (HTTP节点) 方案
            // 草料接口返回流式数据且缺省 Content-Length，直接返回给多维表格会导致下载失败。
            // 我们使用 wsrv.nl (开源图片代理) 作为中间节点（HTTP Proxy），它会获取图片并添加正确的 Headers。
            // 这样既不需要 TOS 存储，也能满足多维表格对 attachment/url 的要求。
            // 注意：wsrv.nl 是公共服务，如果对隐私有极高要求，建议自建 Nginx/Node 代理服务
            const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(apiUrl)}&output=png`;
            log('Generated Proxy URL', proxyUrl);
            // 4. 可选：预检代理链接是否可用 (为了更快的响应，也可以跳过此步直接返回)
            // const checkRes = await context.fetch(proxyUrl, { method: 'HEAD' });
            // if (!checkRes.ok) throw new Error(`Proxy Failed: ${checkRes.status}`);
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: [{
                        name: `qrcode_${Date.now()}.png`,
                        content: proxyUrl,
                        contentType: 'attachment/url',
                    }]
            };
        }
        catch (e) {
            const errMsg = e instanceof Error ? e.message : String(e);
            log('Error Occurred', errMsg);
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtRkFBNEc7QUFDNUcsMERBQWlDO0FBS2pDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLE1BQU0sZUFBZSxHQUFHLG9CQUFvQixDQUFDO0FBQzdDLE1BQU0sa0JBQWtCLEdBQUcsa0NBQWtDLENBQUM7QUFDOUQsTUFBTSwwQkFBMEIsR0FBRyxzQkFBc0IsQ0FBQztBQUUxRCxNQUFNLE1BQU0sR0FBRztJQUNiLFNBQVMsRUFBRTtRQUNULFdBQVcsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsZUFBZTtRQUNqRSxnQkFBZ0I7UUFDaEIsaUJBQWlCLEVBQUUsUUFBUTtRQUMzQixlQUFlO1FBQ2YsMkJBQTJCO1FBQzNCLHVDQUF1QztRQUN2QyxTQUFTLEVBQUUsa0JBQWtCO0tBQzlCO0NBQ0YsQ0FBQztBQUVGLGtDQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV4QyxNQUFNLEtBQUssR0FBRztJQUNaLGdCQUFnQixDQUFDLEtBQWM7UUFDN0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLE1BQU0sTUFBTSxHQUEyQixFQUFFLENBQUM7UUFDMUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUM5RCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJ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