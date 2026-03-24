"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 添加允许的域名
block_basekit_server_api_1.basekit.addDomainList(['searchcompany.apistore.cn']);
block_basekit_server_api_1.basekit.addField({
    // 国际化配置
    i18n: {
        messages: {
            'zh-CN': {
                param_company_field_label: '企业名称字段',
                param_company_field_placeholder: '示例：深圳市腾讯计算机系统有限公司',
                res_company_name_label: '公司名称',
                res_company_name_old_label: '曾用名',
                res_company_name_en_label: '英文名称',
                res_credit_code_label: '信用代码',
                res_company_code_label: '组织机构代码',
                res_reg_number_label: '注册号',
                res_tax_number_label: '税号',
                res_reg_type_label: '公司类型',
                res_reg_org_name_label: '登记机关',
                res_fa_ren_label: '法人',
                res_company_type_label: '法人类型',
                res_business_status_label: '企业状态',
                res_chk_date_label: '核准日期',
                res_issue_time_label: '成立时间',
                res_reg_date_label: '营业期限自',
                res_bussiness_label: '营业期限至',
                res_cancel_date_label: '注销日期',
                res_reg_money_label: '注册资金',
                res_address_label: '注册地址',
                res_bussiness_des_label: '经营范围',
                res_phone_label: '电话',
                res_phone_list_label: '电话列表',
                res_email_label: '邮箱',
                res_email_list_label: '邮箱列表',
                res_web_site_label: '网址',
                res_web_site_list_label: '网址列表',
                res_province_label: '省',
                res_city_label: '市',
                res_area_label: '区',
                res_industry_label: '所属行业',
            },
        },
    },
    // 表单配置
    formItems: [
        {
            key: 'companyName',
            label: '企业全称',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                placeholder: '选择包含企业全称的字段',
                supportType: [block_basekit_server_api_1.FieldType.Text]
            },
            tooltips: [
                {
                    type: 'text',
                    content: '选择包含企业全称的字段，确保查询结果的准确性'
                }
            ],
            validator: {
                required: true,
            },
        },
    ],
    // 执行函数 - 调用真实API获取企业信息
    execute: async (formItemParams, context) => {
        // 输入标准化与校验工具
        const normalizeInput = (v) => {
            if (!v)
                return '';
            // 去除所有空白字符、换行符、制表符
            let cleaned = v.replace(/[\s\n\r\t]+/g, '');
            // 去除常见的占位符和特殊符号
            cleaned = cleaned.replace(/[\-_\*\#\@\$\%\^\&\(\)\[\]\{\}\|\\\~\`]/g, '');
            // 去除多余的标点符号（保留中文公司常用的符号）
            cleaned = cleaned.replace(/[^\u4e00-\u9fa5a-zA-Z0-9（）()]/g, '');
            return cleaned.trim();
        };
        const validateCompanyName = (v) => {
            if (!v)
                return { ok: false, reason: 'empty' };
            // 基本长度校验，企业名称通常不会太短
            if (v.length < 3)
                return { ok: false, reason: 'too-short' };
            return { ok: true };
        };
        const { companyName: companyField } = formItemParams;
        const companyNameRaw = companyField?.[0]?.text;
        const companyName = normalizeInput(companyNameRaw);
        if (!companyName) {
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                message: '请输入企业名称（示例：深圳市腾讯计算机系统有限公司）'
            };
        }
        const v = validateCompanyName(companyName);
        if (!v.ok) {
            const reasonMap = {
                empty: '不能为空',
                'too-short': '企业名称过短，请输入完整的企业名称',
            };
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                message: `企业名称格式不正确：${reasonMap[v.reason] || '请检查输入'}。示例：深圳市腾讯计算机系统有限公司`
            };
        }
        // 调用真实的企业工商信息查询API
        try {
            // 从 API 文档获取配置信息
            const appCode = "f682ec4893d64a50a208cbcd3c03e01d";
            const response = await context.fetch(`https://searchcompany.apistore.cn/search?companyName=${encodeURIComponent(companyName)}`, {
                method: "GET",
                headers: {
                    "Authorization": `APPCODE ${appCode}`,
                },
            });
            if (!response.ok) {
                const statusMessages = {
                    400: '请求参数错误，请检查企业名称格式',
                    401: '接口认证失败，请联系管理员',
                    403: '接口访问被拒绝，请联系管理员',
                    404: '接口服务不存在，请联系管理员',
                    429: '请求过于频繁，请稍后重试',
                    500: '服务器内部错误，请稍后重试',
                    502: '网关错误，请稍后重试',
                    503: '服务暂时不可用，请稍后重试',
                    504: '请求超时，请稍后重试',
                    555: '企业名称不存在或格式不正确，请检查后重试'
                };
                const message = statusMessages[response.status] || `网络请求失败（错误代码：${response.status}），请稍后重试`;
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    message: message
                };
            }
            // 稳健的 JSON 解析
            const rawText = await response.text();
            let result;
            try {
                result = JSON.parse(rawText);
            }
            catch {
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    message: '服务响应异常：返回不是合法 JSON（可能为 HTML 或空响应）。请稍后重试或联系服务提供方'
                };
            }
            // 根据API响应格式解析结果
            if (result.error_code === 50002) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    message: '查询无结果：未找到该企业信息，请确认企业名称是否正确'
                };
            }
            if (result.error_code === 80099) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    message: '交易失败，请稍候再试'
                };
            }
            if (result.error_code !== 0) {
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    message: `查询失败：${result.reason || '服务返回错误'}`
                };
            }
            // 映射API返回的字段到输出格式
            const companyData = result.result || {};
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    // 映射所有API返回的字段
                    companyName: companyData.companyName || companyName,
                    companyNameold: companyData.companyNameold || '',
                    companyNameEn: companyData.companyNameEn || '',
                    creditCode: companyData.creditCode || '',
                    companyCode: companyData.companyCode || '',
                    regNumber: companyData.regNumber || '',
                    taxNumber: companyData.taxNumber || '',
                    regType: companyData.regType || '',
                    regOrgName: companyData.regOrgName || '',
                    faRen: companyData.faRen || '',
                    companyType: companyData.companyType || '',
                    businessStatus: companyData.businessStatus || '',
                    chkDate: companyData.chkDate || '',
                    issueTime: companyData.issueTime || '',
                    regDate: companyData.regDate || '',
                    bussiness: companyData.bussiness || '',
                    cancelDate: companyData.cancelDate || '',
                    regMoney: companyData.regMoney || '',
                    address: companyData.address || '',
                    bussinessDes: companyData.bussinessDes || '',
                    phone: companyData.phone || '',
                    phonelist: companyData.phonelist || '',
                    email: companyData.email || '',
                    emaillist: companyData.emaillist || '',
                    webSite: companyData.webSite || '',
                    webSitelist: companyData.webSitelist || '',
                    province: companyData.province || '',
                    city: companyData.city || '',
                    area: companyData.area || '',
                    industry: companyData.industry || ''
                }
            };
        }
        catch (error) {
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                message: `网络请求失败：${error?.message || '未知错误'}`
            };
        }
    },
    // 返回结果类型定义 - 完整字段定义
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://i.imgur.com/yTIwDzt.png',
            },
            properties: [
                { key: 'companyName', label: t('res_company_name_label'), type: block_basekit_server_api_1.FieldType.Text, isGroupByKey: true, primary: true },
                { key: 'companyNameold', label: t('res_company_name_old_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'companyNameEn', label: t('res_company_name_en_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'creditCode', label: t('res_credit_code_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'companyCode', label: t('res_company_code_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'regNumber', label: t('res_reg_number_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'taxNumber', label: t('res_tax_number_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'regType', label: t('res_reg_type_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'regOrgName', label: t('res_reg_org_name_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'faRen', label: t('res_fa_ren_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'companyType', label: t('res_company_type_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'businessStatus', label: t('res_business_status_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'chkDate', label: t('res_chk_date_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'issueTime', label: t('res_issue_time_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'regDate', label: t('res_reg_date_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'bussiness', label: t('res_bussiness_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'cancelDate', label: t('res_cancel_date_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'regMoney', label: t('res_reg_money_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'address', label: t('res_address_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'bussinessDes', label: t('res_bussiness_des_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'phone', label: t('res_phone_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'phonelist', label: t('res_phone_list_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'email', label: t('res_email_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'emaillist', label: t('res_email_list_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'webSite', label: t('res_web_site_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'webSitelist', label: t('res_web_site_list_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'province', label: t('res_province_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'city', label: t('res_city_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'area', label: t('res_area_label'), type: block_basekit_server_api_1.FieldType.Text },
                { key: 'industry', label: t('res_industry_label'), type: block_basekit_server_api_1.FieldType.Text }
            ]
        }
    }
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFNOEM7QUFFOUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsVUFBVTtBQUNWLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO0FBRXJELGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsUUFBUTtJQUNSLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCx5QkFBeUIsRUFBRSxRQUFRO2dCQUNuQywrQkFBK0IsRUFBRSxtQkFBbUI7Z0JBQ3BELHNCQUFzQixFQUFFLE1BQU07Z0JBQzlCLDBCQUEwQixFQUFFLEtBQUs7Z0JBQ2pDLHlCQUF5QixFQUFFLE1BQU07Z0JBQ2pDLHFCQUFxQixFQUFFLE1BQU07Z0JBQzdCLHNCQUFzQixFQUFFLFFBQVE7Z0JBQ2hDLG9CQUFvQixFQUFFLEtBQUs7Z0JBQzNCLG9CQUFvQixFQUFFLElBQUk7Z0JBQzFCLGtCQUFrQixFQUFFLE1BQU07Z0JBQzFCLHNCQUFzQixFQUFFLE1BQU07Z0JBQzlCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLHNCQUFzQixFQUFFLE1BQU07Z0JBQzlCLHlCQUF5QixFQUFFLE1BQU07Z0JBQ2pDLGtCQUFrQixFQUFFLE1BQU07Z0JBQzFCLG9CQUFvQixFQUFFLE1BQU07Z0JBQzVCLGtCQUFrQixFQUFFLE9BQU87Z0JBQzNCLG1CQUFtQixFQUFFLE9BQU87Z0JBQzVCLHFCQUFxQixFQUFFLE1BQU07Z0JBQzdCLG1CQUFtQixFQUFFLE1BQU07Z0JBQzNCLGlCQUFpQixFQUFFLE1BQU07Z0JBQ3pCLHVCQUF1QixFQUFFLE1BQU07Z0JBQy9CLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixvQkFBb0IsRUFBRSxNQUFNO2dCQUM1QixlQUFlLEVBQUUs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V0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO29CQUN0QyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO29CQUN0QyxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sSUFBSSxFQUFFO29CQUNsQyxVQUFVLEVBQUUsV0FBVyxDQUFDLFVBQVUsSUFBSSxFQUFFO29CQUN4QyxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUM5QixXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVcsSUFBSSxFQUFFO29CQUMxQyxjQUFjLEVBQUUsV0FBVyxDQUFDLGNBQWMsSUFBSSxFQUFFO29CQUNoRCxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sSUFBSSxFQUFFO29CQUNsQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO29CQUN0QyxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sSUFBSSxFQUFFO29CQUNsQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO29CQUN0QyxVQUFVLEVBQUUsV0FBVyxDQUFDLFVBQVUsSUFBSSxFQUFFO29CQUN4QyxRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsSUFBSSxFQUFFO29CQUNwQyxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sSUFBSSxFQUFFO29CQUNsQyxZQUFZLEVBQUUsV0FBVyxDQUFDLFlBQVksSUFBSSxFQUFFO29CQUM1QyxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUM5QixTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO29CQUN0QyxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUM5QixTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFFO29CQUN0QyxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU8sSUFBSSxFQUFFO29CQUNsQyxXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVcsSUFBSSxFQUFFO29CQUMxQyxRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsSUFB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