"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'service.best-expo.com.cn']);
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh-CN': {
                'title': '展商数据推送工具',
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
                'title': 'Exhibitor Push Tool',
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
                'title': '出展者プッシュツール',
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: 'Beijing Tech Co., Ltd',
                tooltips: '公司名称（英文），可选',
            },
        },
        {
            key: 'area',
            label: t('area'),
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: 'RS',
                tooltips: '展位类型：RS=光地，SS=标摊，默认 RS',
            },
        },
        {
            key: 'lang',
            label: t('lang'),
            component: block_basekit_server_api_1.FieldComponent.Input,
            props: {
                placeholder: 'CN',
                tooltips: '语言设置：CN=中文，EN=英文，默认 CN',
            },
        },
    ],
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
                    key: 'status',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('status'),
                    primary: true,
                },
                {
                    key: 'code',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('code'),
                },
                {
                    key: 'message',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('message'),
                },
                {
                    key: 'response',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('response'),
                },
            ],
        },
    },
    execute: async (formItemParams, context) => {
        function debugLog(arg, showContext = false) {
            if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
            }
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg,
            }), '\n');
        }
        debugLog('=====start=====exhibitor-push-single v2', true);
        const endpoint = 'http://service.best-expo.com.cn/geturl/lark/UpExhibitors.ashx';
        // Helper to get string value from input param
        function getStringValue(v) {
            if (v === null || v === undefined)
                return '';
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
        const errors = [];
        if (!payload.booth_no)
            errors.push('booth_no必填');
        if (!payload.hall)
            errors.push('hall必填');
        if (!payload.company_name)
            errors.push('company_name必填');
        if (!payload.area)
            errors.push('area必填');
        if (!payload.username)
            errors.push('username必填');
        if (!payload.password)
            errors.push('password必填');
        if (!payload.contact_name)
            errors.push('contact_name必填');
        if (!payload.contact_email)
            errors.push('contact_email必填');
        if (payload.booth_no && !/^[A-Za-z0-9_-]+$/.test(payload.booth_no))
            errors.push('booth_no格式错误(仅允许英文数字下划线连字符)');
        if (payload.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact_email))
            errors.push('contact_email格式错误');
        if (payload.area && isNaN(Number(payload.area)))
            errors.push('area必须为数字');
        if (errors.length > 0) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
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
            let parsed;
            try {
                parsed = JSON.parse(resText);
            }
            catch (e) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
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
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    id: context.logID || `${Math.random()}`,
                    status: isSuccess ? '推送成功' : '推送失败',
                    code: String(parsed.code || ''),
                    message: String(parsed.message || ''),
                    response: resText.slice(0, 4000),
                },
            };
        }
        catch (e) {
            debugLog({ '===999 异常错误': String(e) });
            return {
                code: block_basekit_server_api_1.FieldCode.Success, // Keep Success to show error in fields
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
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNkg7QUFDN0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBRWpFLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixVQUFVLEVBQUUsS0FBSztnQkFDakIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsY0FBYyxFQUFFLFVBQVU7Z0JBQzFCLGlCQUFpQixFQUFFLFVBQVU7Z0JBQzdCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixVQUFVLEVBQUUsTUFBTTtnQkFDbEIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLGNBQWMsRUFBRSxPQUFPO2dCQUN2QixlQUFlLEVBQUUsT0FBTztnQkFDeEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFVBQVUsRUFBRSxNQUFNO2FBQ25CO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxxQkFBcUI7Z0JBQzlCLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixNQUFNLEVBQUUsU0FBUztnQkFDakIsY0FBYyxFQUFFLG1CQUFtQjtnQkFDbkMsaUJBQWlCLEVBQUUsbUJBQW1CO2dCQUN0QyxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsVUFBVSxFQUFF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