import {
  basekit,
  FieldType,
  field,
  FieldComponent,
  FieldCode,
} from '@lark-opdev/block-basekit-server-api';

const { t } = field;

// 添加允许的域名
basekit.addDomainList(['searchcompany.apistore.cn']);

basekit.addField({
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
      component: FieldComponent.FieldSelect,
      props: {
        placeholder: '选择包含企业全称的字段',
        supportType: [FieldType.Text]
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
  execute: async (formItemParams: any, context) => {
    // 输入标准化与校验工具
    const normalizeInput = (v?: string) => {
      if (!v) return '';
      // 去除所有空白字符、换行符、制表符
      let cleaned = v.replace(/[\s\n\r\t]+/g, '');
      // 去除常见的占位符和特殊符号
      cleaned = cleaned.replace(/[\-_\*\#\@\$\%\^\&\(\)\[\]\{\}\|\\\~\`]/g, '');
      // 去除多余的标点符号（保留中文公司常用的符号）
      cleaned = cleaned.replace(/[^\u4e00-\u9fa5a-zA-Z0-9（）()]/g, '');
      return cleaned.trim();
    };

    const validateCompanyName = (v: string) => {
      if (!v) return { ok: false as const, reason: 'empty' as const };
      // 基本长度校验，企业名称通常不会太短
      if (v.length < 3) return { ok: false as const, reason: 'too-short' as const };
      return { ok: true as const };
    };

    const { companyName: companyField } = formItemParams;
    const companyNameRaw = companyField?.[0]?.text;
    const companyName = normalizeInput(companyNameRaw);

    if (!companyName) {
      return {
        code: FieldCode.Error,
        message: '请输入企业名称（示例：深圳市腾讯计算机系统有限公司）'
      };
    }

    const v = validateCompanyName(companyName);
    if (!v.ok) {
      const reasonMap: Record<string, string> = {
        empty: '不能为空',
        'too-short': '企业名称过短，请输入完整的企业名称',
      };
      return {
        code: FieldCode.Error,
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
        const statusMessages: Record<number, string> = {
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
          code: FieldCode.Error,
          message: message
        };
      }

      // 稳健的 JSON 解析
      const rawText = await response.text();
      let result: any;
      try {
        result = JSON.parse(rawText);
      } catch {
        return {
          code: FieldCode.Error,
          message: '服务响应异常：返回不是合法 JSON（可能为 HTML 或空响应）。请稍后重试或联系服务提供方'
        };
      }

      // 根据API响应格式解析结果
      if (result.error_code === 50002) {
        return {
          code: FieldCode.Error,
          message: '查询无结果：未找到该企业信息，请确认企业名称是否正确'
        };
      }

      if (result.error_code === 80099) {
        return {
          code: FieldCode.Error,
          message: '交易失败，请稍候再试'
        };
      }

      if (result.error_code !== 0) {
        return {
          code: FieldCode.Error,
          message: `查询失败：${result.reason || '服务返回错误'}`
        };
      }

      // 映射API返回的字段到输出格式
      const companyData = result.result || {};

      return {
        code: FieldCode.Success,
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

    } catch (error: any) {
      return {
        code: FieldCode.Error,
        message: `网络请求失败：${error?.message || '未知错误'}`
      };
    }
  },
  
  // 返回结果类型定义 - 完整字段定义
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://i.imgur.com/yTIwDzt.png',
      },
      properties: [
        { key: 'companyName', label: t('res_company_name_label'), type: FieldType.Text, isGroupByKey: true, primary: true },
        { key: 'companyNameold', label: t('res_company_name_old_label'), type: FieldType.Text },
        { key: 'companyNameEn', label: t('res_company_name_en_label'), type: FieldType.Text },
        { key: 'creditCode', label: t('res_credit_code_label'), type: FieldType.Text },
        { key: 'companyCode', label: t('res_company_code_label'), type: FieldType.Text },
        { key: 'regNumber', label: t('res_reg_number_label'), type: FieldType.Text },
        { key: 'taxNumber', label: t('res_tax_number_label'), type: FieldType.Text },
        { key: 'regType', label: t('res_reg_type_label'), type: FieldType.Text },
        { key: 'regOrgName', label: t('res_reg_org_name_label'), type: FieldType.Text },
        { key: 'faRen', label: t('res_fa_ren_label'), type: FieldType.Text },
        { key: 'companyType', label: t('res_company_type_label'), type: FieldType.Text },
        { key: 'businessStatus', label: t('res_business_status_label'), type: FieldType.Text },
        { key: 'chkDate', label: t('res_chk_date_label'), type: FieldType.Text },
        { key: 'issueTime', label: t('res_issue_time_label'), type: FieldType.Text },
        { key: 'regDate', label: t('res_reg_date_label'), type: FieldType.Text },
        { key: 'bussiness', label: t('res_bussiness_label'), type: FieldType.Text },
        { key: 'cancelDate', label: t('res_cancel_date_label'), type: FieldType.Text },
        { key: 'regMoney', label: t('res_reg_money_label'), type: FieldType.Text },
        { key: 'address', label: t('res_address_label'), type: FieldType.Text },
        { key: 'bussinessDes', label: t('res_bussiness_des_label'), type: FieldType.Text },
        { key: 'phone', label: t('res_phone_label'), type: FieldType.Text },
        { key: 'phonelist', label: t('res_phone_list_label'), type: FieldType.Text },
        { key: 'email', label: t('res_email_label'), type: FieldType.Text },
        { key: 'emaillist', label: t('res_email_list_label'), type: FieldType.Text },
        { key: 'webSite', label: t('res_web_site_label'), type: FieldType.Text },
        { key: 'webSitelist', label: t('res_web_site_list_label'), type: FieldType.Text },
        { key: 'province', label: t('res_province_label'), type: FieldType.Text },
        { key: 'city', label: t('res_city_label'), type: FieldType.Text },
        { key: 'area', label: t('res_area_label'), type: FieldType.Text },
        { key: 'industry', label: t('res_industry_label'), type: FieldType.Text }
      ]
    }
  }
});

export default basekit;