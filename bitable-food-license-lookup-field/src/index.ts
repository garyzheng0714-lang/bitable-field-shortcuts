import {
  basekit,
  FieldType,
  field,
  FieldComponent,
  FieldCode,
} from '@lark-opdev/block-basekit-server-api';
import appConfig from '../config.json';

const { t } = field;

// 添加允许的域名
basekit.addDomainList(['clsearch13.market.alicloudapi.com']);

basekit.addField({
  // 移除授权配置，简化实现
  
  // 国际化配置
  i18n: {
    messages: {
      'zh-CN': {
        param_license_field_label: '食品生产许可证字段',
        param_license_field_placeholder: '示例：SC10131011507490',
        res_producer_name_label: '生产者名称',
        res_lic_no_label: '许可证编号',
        res_credit_code_label: '社会信用代码',
        res_manage_org_label: '日常监督管理机构',
        res_legal_person_label: '法定代表人',
        res_manage_person_label: '日常监督管理人员',
        res_residence_label: '住所',
        res_issue_unit_label: '发证机关',
        res_category_label: '食品类别',
        res_issuer_label: '签发人',
        res_product_addr_label: '生产地址',
        res_valid_end_label: '有效期至',
        res_status_label: '状态',
      },
    },
  },
  
  // 表单配置
  formItems: [
    {
      key: 'licenseField',
      label: t('param_license_field_label'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: t('param_license_field_placeholder'),
      },
      validator: {
        required: true,
      },
    },
  ],
  
  // 执行函数 - 调用真实API获取许可证信息
  execute: async (formItemParams: any, context) => {
    // 新增：输入标准化与校验工具
    const normalizeInput = (v?: string) =>
      (v ?? '').replace(/\s+/g, '').replace(/\*/g, '').toUpperCase();

    const validateLicense = (v: string) => {
      if (!v) return { ok: false as const, reason: 'empty' as const };
      // 必须以 SC 开头，且后续为纯数字（更严格，避免无效调用）
      if (!/^SC\d+$/.test(v)) return { ok: false as const, reason: 'format' as const };
      // 常见总长度：16 或 17 位（含前缀 SC），不在此范围则视为明显不规范，直接短路
      const totalLen = v.length;
      if (totalLen !== 16 && totalLen !== 17) return { ok: false as const, reason: 'length-atypical' as const };
      return { ok: true as const };
    };

    const { licenseField } = formItemParams;
    const licenseNumberRaw = licenseField?.[0]?.text;
    const licenseNumber = normalizeInput(licenseNumberRaw);

    if (!licenseNumber) {
      return {
        code: FieldCode.Error,
        message: '请输入食品许可证编号（示例：SC110230521044400，不含空格或*）'
      };
    }

    const v = validateLicense(licenseNumber);
    if (!v.ok) {
      const reasonMap: Record<string, string> = {
        empty: '不能为空',
        format: '格式不正确，应以 SC 开头，且后续为纯数字',
        'length-atypical': '位数不在常见范围（通常为 16 或 17 位）',
      };
      return {
        code: FieldCode.Error,
        message: `许可证编号格式不正确：${reasonMap[v.reason] || '请检查输入' }。示例：SC110230521044400`
      };
    }
    
    // 调用真实的食品许可证查询API
    try {
      // 从 config.json 获取配置信息（建议替换为你的真实值）
      const appCode = String((appConfig as any)?.authorizations?.[0]?.[0] || ''); // 从 config.json 读取 AppCode
      const appId = String((appConfig as any)?._AppKey || ''); // 从 config.json 读取 AppKey

      // 构建请求体
      const now = new Date();
      const timestamp = now.getFullYear() + "-" +
                       String(now.getMonth() + 1).padStart(2, '0') + "-" +
                       String(now.getDate()).padStart(2, '0') + " " +
                       String(now.getHours()).padStart(2, '0') + ":" +
                       String(now.getMinutes()).padStart(2, '0') + ":" +
                       String(now.getSeconds()).padStart(2, '0');

      const requestBody = {
        app_id: appId,
        version: "1.0",
        charset: "utf-8",
        format: "json",
        timestamp: timestamp,
        sign_type: "RSA2",
        sign: "gR+0+TsgD", // 供应商若要求真实签名，这里需要替换为实际签名
        method: "com.general.searchDetail",
        biz_content: {
          type: "13",
          uniqueNo: licenseNumber
        }
      };

      // 生成随机UUID用于X-Ca-Nonce
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const response = await context.fetch("https://clsearch13.market.alicloudapi.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Accept": "application/json",
          "Authorization": `APPCODE ${appCode}`,
          "X-Ca-Nonce": generateUUID()
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        return {
          code: FieldCode.Error,
          message: `接口请求失败：HTTP ${response.status} ${response.statusText}。请稍后重试或检查 AppCode 是否有效`
        };
      }

      // 新增：更稳健的 JSON 解析，避免“invalid-json”只提示运行失败
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
      const responseData = result?.com_general_searchDetail_response;
      if (!responseData) {
        return {
          code: FieldCode.Error,
          message: '服务响应结构异常：缺少 com_general_searchDetail_response 字段'
        };
      }

      // 更友好的错误信息
      if (responseData.code === 2002) {
        return {
          code: FieldCode.Error,
          message: '查询无结果：未找到该许可证编号，请确认输入是否正确'
        };
      }

      if (responseData.code !== 1000) {
        return {
          code: FieldCode.Error,
          message: `查询失败：${responseData.msg || '服务返回错误'}`
        };
      }

      // 映射API返回的字段到输出格式
      const licenseData = responseData.result || {};

      // 状态映射函数
      const getStatusText = (status: string | number) => {
        switch(String(status)) {
          case '1': return '有效';
          case '2': return '过期/注销/吊销';
          default: return '未知';
        }
      };

      return {
        code: FieldCode.Success,
        data: {
          // 先合入 API 的全部字段，随后用友好字段覆盖/补齐
          ...licenseData,
          licNo: licenseData.licNo || licenseNumber,
          producerName: licenseData.producerName || '未知',
          productAddr: licenseData.productAddr || '未知',
          creditCode: licenseData.creditCode || '未知',
          legalPerson: licenseData.legalPerson || '未知',
          manageOrg: licenseData.manageOrg || '未知',
          residence: licenseData.residence || '未知',
          category: licenseData.category || '未知',
          issueUnit: licenseData.issueUnit || '未知',
          validEnd: licenseData.validEnd || '未知',
          issuer: licenseData.issuer || '未知',
          managePerson: licenseData.managePerson || '未知',
          status: getStatusText(licenseData.status)
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
         light: 'https://img.alicdn.com/tfs/TB1qNVdXlGw3KVjSZFDXXXWEpXa-160-160.png',
       },
       properties: [
         { key: 'producerName', label: t('res_producer_name_label'), type: FieldType.Text, isGroupByKey: true },
         { key: 'licNo', label: t('res_lic_no_label'), type: FieldType.Text, primary: true },
         { key: 'creditCode', label: t('res_credit_code_label'), type: FieldType.Text },
         { key: 'manageOrg', label: t('res_manage_org_label'), type: FieldType.Text },
         { key: 'legalPerson', label: t('res_legal_person_label'), type: FieldType.Text },
         { key: 'managePerson', label: t('res_manage_person_label'), type: FieldType.Text },
         { key: 'residence', label: t('res_residence_label'), type: FieldType.Text },
         { key: 'issueUnit', label: t('res_issue_unit_label'), type: FieldType.Text },
         { key: 'category', label: t('res_category_label'), type: FieldType.Text },
         { key: 'issuer', label: t('res_issuer_label'), type: FieldType.Text },
         { key: 'productAddr', label: t('res_product_addr_label'), type: FieldType.Text },
         { key: 'validEnd', label: t('res_valid_end_label'), type: FieldType.Text },
         { key: 'status', label: t('res_status_label'), type: FieldType.Text }
       ]
     }
   }
});

export default basekit;
