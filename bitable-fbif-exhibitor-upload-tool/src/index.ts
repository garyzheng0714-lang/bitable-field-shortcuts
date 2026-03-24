import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
basekit.addDomainList([...feishuDm, 'service.best-expo.com.cn']);

basekit.addField({
  i18n: {
    messages: {
      'zh-CN': {
        'title': '【FBIF】展商报馆信息上传工具',
        'booth_no': '展位号',
        'hall': '展馆编号',
        'company_name': '公司名称（中文）',
        'company_name_en': '公司名称（英文）',
        'area': '展位面积',
        'username': '登录账号',
        'password': '登录密码',
        'booth_type': '展位类型',
        'contact_name': '联系人姓名',
        'contact_email': '联系人邮箱',
        'lang': '语言',
        'status': '状态',
        'code': '接口返回码',
        'message': '接口返回消息',
        'response': '完整响应',
      },
      'en-US': {
        'title': '【FBIF】Exhibitor Upload Tool',
        'booth_no': 'Booth No',
        'hall': 'Hall No',
        'company_name': 'Company Name (CN)',
        'company_name_en': 'Company Name (EN)',
        'area': 'Booth Area',
        'username': 'Username',
        'password': 'Password',
        'booth_type': 'Booth Type',
        'contact_name': 'Contact Name',
        'contact_email': 'Contact Email',
        'lang': 'Language',
        'status': 'Status',
        'code': 'Response Code',
        'message': 'Response Message',
        'response': 'Full Response',
      },
      'ja-JP': {
        'title': '【FBIF】出展者アップロードツール',
        'booth_no': 'ブース番号',
        'hall': 'ホール番号',
        'company_name': '会社名（中国語）',
        'company_name_en': '会社名（英語）',
        'area': 'ブース面積',
        'username': 'ユーザー名',
        'password': 'パスワード',
        'booth_type': 'ブースタイプ',
        'contact_name': '担当者名',
        'contact_email': '担当者メール',
        'lang': '言語',
        'status': 'ステータス',
        'code': 'レスポンスコード',
        'message': 'レスポンスメッセージ',
        'response': '完全なレスポンス',
      },
    },
  },
  formItems: [
    {
      key: 'booth_no',
      label: t('booth_no'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'A001',
        tooltips: '展位号，不能包含特殊字符',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'hall',
      label: t('hall'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'W1',
        tooltips: '展馆编号',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'company_name',
      label: t('company_name'),
      component: FieldComponent.Input,
      props: {
        placeholder: '北京科技有限公司',
        tooltips: '公司名称（中文）',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'company_name_en',
      label: t('company_name_en'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'Beijing Tech Co., Ltd',
        tooltips: '公司名称（英文），可选',
      },
    },
    {
      key: 'area',
      label: t('area'),
      component: FieldComponent.Input,
      props: {
        placeholder: '36',
        tooltips: '展位面积（平方米），必须为数字',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'username',
      label: t('username'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'booth_001',
        tooltips: '登录账号（唯一标识）',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'password',
      label: t('password'),
      component: FieldComponent.Input,
      props: {
        placeholder: '123456',
        tooltips: '登录密码',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'contact_name',
      label: t('contact_name'),
      component: FieldComponent.Input,
      props: {
        placeholder: '张三',
        tooltips: '联系人姓名',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'contact_email',
      label: t('contact_email'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'zhangsan@company.com',
        tooltips: '联系人邮箱',
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'booth_type',
      label: t('booth_type'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'RS',
        tooltips: '展位类型：RS=光地，SS=标摊，默认 RS',
      },
    },
    {
      key: 'lang',
      label: t('lang'),
      component: FieldComponent.Input,
      props: {
        placeholder: 'CN',
        tooltips: '语言设置：CN=中文，EN=英文，默认 CN',
      },
    },
  ],
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
          key: 'status',
          type: FieldType.Text,
          label: t('status'),
          primary: true,
        },
        {
          key: 'code',
          type: FieldType.Text,
          label: t('code'),
        },
        {
          key: 'message',
          type: FieldType.Text,
          label: t('message'),
        },
        {
          key: 'response',
          type: FieldType.Text,
          label: t('response'),
        },
      ],
    },
  },
  execute: async (
    formItemParams: {
      booth_no: string;
      hall: string;
      company_name: string;
      company_name_en?: string;
      area: string;
      username: string;
      password: string;
      contact_name: string;
      contact_email: string;
      booth_type?: string;
      lang?: string;
    },
    context: any,
  ) => {
    function debugLog(arg: any, showContext = false) {
      if (!showContext) {
        console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
        return;
      }
      console.log(
        JSON.stringify({
          formItemParams,
          context,
          arg,
        }),
        '\n',
      );
    }

    debugLog('=====start=====exhibitor-push-single v2', true);
    const endpoint = 'http://service.best-expo.com.cn/geturl/lark/UpExhibitors.ashx';

    // Helper to get string value from input param
    function getStringValue(v: any): string {
      if (v === null || v === undefined) return '';
      return String(v).trim();
    }

    const payload = {
      booth_no: getStringValue(formItemParams.booth_no),
      hall: getStringValue(formItemParams.hall),
      company_name: getStringValue(formItemParams.company_name),
      company_name_en: getStringValue(formItemParams.company_name_en),
      area: getStringValue(formItemParams.area),
      username: getStringValue(formItemParams.username),
      password: getStringValue(formItemParams.password),
      booth_type: getStringValue(formItemParams.booth_type) || 'RS',
      contact_name: getStringValue(formItemParams.contact_name),
      contact_email: getStringValue(formItemParams.contact_email),
      lang: getStringValue(formItemParams.lang) || 'CN',
    };

    debugLog({ '===push payload': payload });

    // Validate payload
    const errors: string[] = [];
    if (!payload.booth_no) errors.push('booth_no必填');
    if (!payload.hall) errors.push('hall必填');
    if (!payload.company_name) errors.push('company_name必填');
    if (!payload.area) errors.push('area必填');
    if (!payload.username) errors.push('username必填');
    if (!payload.password) errors.push('password必填');
    if (!payload.contact_name) errors.push('contact_name必填');
    if (!payload.contact_email) errors.push('contact_email必填');
    
    if (payload.booth_no && !/^[A-Za-z0-9_-]+$/.test(payload.booth_no)) errors.push('booth_no格式错误(仅允许英文数字下划线连字符)');
    if (payload.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact_email)) errors.push('contact_email格式错误');
    if (payload.area && isNaN(Number(payload.area))) errors.push('area必须为数字');

    if (errors.length > 0) {
      return {
        code: FieldCode.Success,
        data: {
          id: context.logID || `${Math.random()}`,
          status: '校验失败',
          code: '400',
          message: errors.join('; '),
          response: '',
        },
      };
    }

    try {
      const res = await context.fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const resText = await res.text();
      debugLog({ '===push response': resText.slice(0, 1000) });

      let parsed: any;
      try {
        parsed = JSON.parse(resText);
      } catch (e) {
        return {
          code: FieldCode.Success,
          data: {
            id: context.logID || `${Math.random()}`,
            status: '响应解析失败',
            code: '500',
            message: '响应非JSON格式',
            response: resText.slice(0, 4000),
          },
        };
      }

      const isSuccess = String(parsed.code) === '200';
      return {
        code: FieldCode.Success,
        data: {
          id: context.logID || `${Math.random()}`,
          status: isSuccess ? '推送成功' : '推送失败',
          code: String(parsed.code || ''),
          message: String(parsed.message || ''),
          response: resText.slice(0, 4000),
        },
      };

    } catch (e) {
      debugLog({ '===999 异常错误': String(e) });
      return {
        code: FieldCode.Success, // Keep Success to show error in fields
        data: {
          id: context.logID || `${Math.random()}`,
          status: '请求异常',
          code: '500',
          message: String(e),
          response: '',
        },
      };
    }
  },
});
export default basekit;
