import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
import CryptoJS from 'crypto-js';

declare const console: any;
declare const process: any;

const { t } = field;

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

basekit.addDomainList(CONFIG.WHITELIST);

const Logic = {
  parseExtraParams(input?: string): Record<string, string> {
    const text = String(input || '').trim();
    if (!text) return {};
    const parsed: Record<string, string> = {};
    const searchParams = new URLSearchParams(text);
    for (const [key, value] of Array.from(searchParams.entries())) {
      const k = String(key || '').trim();
      if (!k) continue;
      if (k === 'api_key' || k === 'cliT' || k === 'cliD' || k === 'sign') continue;
      parsed[k] = String(value ?? '');
    }
    return parsed;
  },
  generateApiUrl(params: { apiKey: string; cliT: string; cliD: string; cliP1?: string; extraParams?: Record<string, string>; apiSecret?: string }): string {
    const { apiKey, cliT, cliD, cliP1, extraParams, apiSecret } = params;
    const queryParams: Record<string, string> = {
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
      sign = CryptoJS.MD5(baseString).toString();
    }
    const query: string[] = [];
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


basekit.addField({
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
      component: FieldComponent.SingleSelect,
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
      component: FieldComponent.Input,
      props: { placeholder: '非必填，仅当上方选择“其他自定义标签样式”时生效' },
      validator: { required: false }
    },
    {
      key: 'cliD',
      label: t('content'),
      component: FieldComponent.Input,
      props: { placeholder: '请输入扫描二维码后展示的内容（如网页链接或文本）' },
      validator: { required: true }
    },
  ],
  resultType: {
    type: FieldType.Attachment,
  },
  execute: async (formItemParams: { styleSelect: { value: string }, customStyleId?: string, cliD: string }, context) => {
    const env = process?.env ?? {};
    const apiKey = DEFAULT_API_KEY;
    const apiSecret = DEFAULT_API_SECRET;
    
    // 获取样式ID：如果是自定义，则取 customStyleId，否则取选项值
    let cliT = formItemParams.styleSelect?.value;
    if (cliT === 'custom') {
        cliT = String(formItemParams.customStyleId || '').trim();
    }
    
    const { cliD } = formItemParams;
    
    const log = (msg: string, data?: any) => {
      let safeData: string | undefined = undefined;
      if (data !== undefined && data !== null) {
        if (typeof data === 'string') {
          safeData = data;
        } else {
          try {
            safeData = JSON.stringify(data);
          } catch {
            safeData = String(data);
          }
        }
      }
      console.log(JSON.stringify({ 
        logID: (context as any).logID, 
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
        code: FieldCode.Success,
        data: [{
          name: `qrcode_${Date.now()}.png`,
          content: proxyUrl,
          contentType: 'attachment/url',
        }]
      };

    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      log('Error Occurred', errMsg);
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;
