"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 添加请求接口的域名白名单
block_basekit_server_api_1.basekit.addDomainList(['service.best-expo.com.cn']);
block_basekit_server_api_1.basekit.addField({
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text],
                placeholder: t('keyword_desc'),
            },
            validator: {
                required: true,
            }
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
                    key: 'id',
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: 'id',
                    hidden: true,
                },
                {
                    key: 'BoothExhibitor',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('exhibitor'),
                    primary: true,
                },
                {
                    key: 'BoothID',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('booth_id'),
                },
                {
                    key: 'BoothNO',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('booth_no'),
                },
                {
                    key: 'BoothArea',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('booth_area'),
                },
                {
                    key: 'Hall',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('hall'),
                },
                {
                    key: 'BoothTypeID',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('booth_type_id'),
                },
                {
                    key: 'ShowNameCn',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('show_name'),
                },
                {
                    key: 'DesignUpStatus',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('status'),
                },
                {
                    key: 'DesignUpTime',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('design_up_time'),
                },
                {
                    key: 'DesignList',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('design_list'),
                },
                {
                    key: 'DesignStats',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('design_stats'),
                },
            ],
        },
    },
    // 运行时逻辑
    execute: async (formItemParams, context) => {
        // 确保 keyword 转为字符串后再 trim，防止传入非字符串类型（如数字）导致 crash
        const rawKeyword = formItemParams.keyword;
        const keyword = (rawKeyword !== null && rawKeyword !== undefined) ? String(rawKeyword).trim() : '';
        // 日志辅助函数
        function debugLog(arg) {
            console.log(JSON.stringify({ arg, logID: context.logID }));
        }
        // 记录开始执行
        debugLog(`Start executing with keyword: ${keyword}`);
        if (!keyword) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
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
            }
            catch (e) {
                console.error('JSON Parse Error', e);
                debugLog({ error: 'JSON Parse Error', details: String(e) });
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                };
            }
            // 检查业务状态码
            if (resJson.code !== 0) {
                debugLog(`Business Error: ${resJson.message}`);
                // 如果业务报错，可以返回空或者错误信息对象，这里选择返回空以避免阻塞，或者可视情况调整
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
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
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        id: String(Math.random()),
                        BoothExhibitor: '未查询到数据',
                    }
                };
            }
            // 取第一条数据
            const item = resJson.data[0];
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
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
        }
        catch (e) {
            console.error('Execute Error', e);
            debugLog({ error: 'Execute Exception', details: String(e) });
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNEc7QUFDNUcsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsZUFBZTtBQUNmLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBRXBELGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUUsT0FBTztnQkFDbEIsY0FBYyxFQUFFLG9CQUFvQjtnQkFDcEMsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixNQUFNLEVBQUUsSUFBSTtnQkFDWixXQUFXLEVBQUUsTUFBTTtnQkFDbkIsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixZQUFZLEVBQUUsTUFBTTtnQkFDcEIsZUFBZSxFQUFFLFFBQVE7Z0JBQ3pCLGdCQUFnQixFQUFFLFFBQVE7Z0JBQzFCLGFBQWEsRUFBRSxNQUFNO2dCQUNyQixjQUFjLEVBQUUsUUFBUTthQUN6QjtZQUNELE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUUsZ0JBQWdCO2dCQUMzQixjQUFjLEVBQUUsNkRBQTZEO2dCQUM3RSxXQUFXLEVBQUUsV0FBVztnQkFDeEIsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFdBQVcsRUFBRSxXQUFXO2dCQUN4QixRQUFRLEVBQUUsZUFBZTtnQkFDekIsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixZQUFZLEVBQUUsWUFBWTtnQkFDMUIsZUFBZSxFQUFFLGVBQWU7Z0JBQ2hDLGdCQUFnQixF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