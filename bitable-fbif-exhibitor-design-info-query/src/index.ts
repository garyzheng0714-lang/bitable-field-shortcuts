import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// 添加请求接口的域名白名单
basekit.addDomainList(['service.best-expo.com.cn']);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'keyword': '搜索关键词',
        'keyword_desc': '请选择包含展位号或展商名称的文本字段',
        'exhibitor': '展商名称',
        'booth_no': '展位号',
        'hall': '展馆',
        'show_name': '展会名称',
        'status': '上传状态',
        'stats': '图纸统计',
        'booth_id': '展位ID',
        'booth_area': '展位面积',
        'booth_type_id': '展位类型ID',
        'design_up_time': '设计上传时间',
        'design_list': '图纸列表',
        'design_stats': '图纸统计详情',
      },
      'en-US': {
        'keyword': 'Search Keyword',
        'keyword_desc': 'Select the text field containing Booth No or Exhibitor Name',
        'exhibitor': 'Exhibitor',
        'booth_no': 'Booth No',
        'hall': 'Hall',
        'show_name': 'Show Name',
        'status': 'Upload Status',
        'stats': 'Design Stats',
        'booth_id': 'Booth ID',
        'booth_area': 'Booth Area',
        'booth_type_id': 'Booth Type ID',
        'design_up_time': 'Design Upload Time',
        'design_list': 'Design List',
        'design_stats': 'Design Stats Details',
      },
      'ja-JP': {
        'keyword': '検索キーワード',
        'keyword_desc': 'ブース番号または出展者名を含むテキストフィールドを選択してください',
        'exhibitor': '出展者名',
        'booth_no': 'ブース番号',
        'hall': 'ホール',
        'show_name': '展示会名',
        'status': 'アップロード状態',
        'stats': '図面統計',
        'booth_id': 'ブースID',
        'booth_area': 'ブース面積',
        'booth_type_id': 'ブースタイプID',
        'design_up_time': 'デザインアップロード時間',
        'design_list': 'デザインリスト',
        'design_stats': 'デザイン統計詳細',
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'keyword',
      label: t('keyword'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: t('keyword_desc'),
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
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
          key: 'BoothExhibitor',
          type: FieldType.Text,
          label: t('exhibitor'),
          primary: true,
        },
        {
          key: 'BoothID',
          type: FieldType.Text,
          label: t('booth_id'),
        },
        {
          key: 'BoothNO',
          type: FieldType.Text,
          label: t('booth_no'),
        },
        {
          key: 'BoothArea',
          type: FieldType.Text,
          label: t('booth_area'),
        },
        {
          key: 'Hall',
          type: FieldType.Text,
          label: t('hall'),
        },
        {
          key: 'BoothTypeID',
          type: FieldType.Text,
          label: t('booth_type_id'),
        },
        {
          key: 'ShowNameCn',
          type: FieldType.Text,
          label: t('show_name'),
        },
        {
          key: 'DesignUpStatus',
          type: FieldType.Text,
          label: t('status'),
        },
        {
          key: 'DesignUpTime',
          type: FieldType.Text,
          label: t('design_up_time'),
        },
        {
          key: 'DesignList',
          type: FieldType.Text,
          label: t('design_list'),
        },
        {
          key: 'DesignStats',
          type: FieldType.Text,
          label: t('design_stats'),
        },
      ],
    },
  },
  // 运行时逻辑
  execute: async (formItemParams: { keyword: any }, context) => {
    // 确保 keyword 转为字符串后再 trim，防止传入非字符串类型（如数字）导致 crash
    const rawKeyword = formItemParams.keyword;
    const keyword = (rawKeyword !== null && rawKeyword !== undefined) ? String(rawKeyword).trim() : '';

    // 日志辅助函数
    function debugLog(arg: any) {
      console.log(JSON.stringify({ arg, logID: context.logID }));
    }

    // 记录开始执行
    debugLog(`Start executing with keyword: ${keyword}`);

    if (!keyword) {
      return {
        code: FieldCode.Success,
        data: null
      };
    }

    try {
      const apiUrl = 'http://service.best-expo.com.cn/GetUrl/lark/GetDesignList.ashx';
      // 构建查询参数
      // code: 固定身份验证码
      // limit: 1 (因为我们只取第一个匹配项)
      // keyword: 用户输入的关键词
      const queryParams = new URLSearchParams({
        code: '70EA237E-0EDA-409C-A8C9-6BB22F01CE51',
        keyword: keyword
      });

      const fullUrl = `${apiUrl}?${queryParams.toString()}`;
      debugLog(`Fetching URL: ${fullUrl}`);

      const res = await context.fetch(fullUrl, {
        method: 'GET'
      });

      const resText = await res.text();
      // 截取部分日志防止过长
      debugLog(`API Response: ${resText.slice(0, 500)}`);

      let resJson;
      try {
        resJson = JSON.parse(resText);
      } catch (e) {
        console.error('JSON Parse Error', e);
        debugLog({ error: 'JSON Parse Error', details: String(e) });
        return {
          code: FieldCode.Error,
        };
      }

      // 检查业务状态码
      if (resJson.code !== 0) {
        debugLog(`Business Error: ${resJson.message}`);
        // 如果业务报错，可以返回空或者错误信息对象，这里选择返回空以避免阻塞，或者可视情况调整
        return {
          code: FieldCode.Success,
          data: {
             id: String(Math.random()),
             BoothExhibitor: `查询失败: ${resJson.message || '未知错误'}`
          }
        };
      }

      // 检查是否有数据
      if (!resJson.data || !Array.isArray(resJson.data) || resJson.data.length === 0) {
        debugLog('No data found');
        return {
          code: FieldCode.Success,
          data: {
            id: String(Math.random()),
            BoothExhibitor: '未查询到数据',
          }
        };
      }

      // 取第一条数据
      const item = resJson.data[0];
      
      return {
        code: FieldCode.Success,
        data: {
          id: item.BoothID || String(Math.random()),
          BoothExhibitor: item.BoothExhibitor,
          BoothID: item.BoothID,
          BoothNO: item.BoothNO,
          BoothArea: item.BoothArea,
          Hall: item.Hall,
          BoothTypeID: item.BoothTypeID,
          ShowNameCn: item.ShowNameCn,
          DesignUpStatus: item.DesignUpStatus,
          DesignUpTime: item.DesignUpTime,
          DesignList: JSON.stringify(item.DesignList),
          DesignStats: JSON.stringify(item.DesignStats),
        }
      };

    } catch (e) {
      console.error('Execute Error', e);
      debugLog({ error: 'Execute Exception', details: String(e) });
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;
