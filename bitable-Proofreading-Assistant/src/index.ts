import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// 允许请求的域名白名单
basekit.addDomainList(['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com', 'open.feishu.cn']);

// ========== 文本清理：去除 Markdown/HTML/多余空白，保留纯文本 ==========
function sanitizeMarkdownPlain(input: string): string {
  if (!input) return '';
  let text = String(input).replace(/\r\n?/g, '\n');
  // 去掉围栏代码围栏，保留内容
  text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, '').trim());
  // 行内代码 `code` -> code
  text = text.replace(/`([^`]+)`/g, '$1');
  // 图片 ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\((?:[^)]+)\)/g, '$1');
  // 链接 [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1');
  // 标题符号 #
  text = text.replace(/^(?:\s{0,3}#{1,6}\s+)(.*)$/gm, '$1');
  // 引用 >
  text = text.replace(/^\s{0,3}>\s?(.*)$/gm, '$1');
  // 列表符号 -*+ 以及 1.
  text = text.replace(/^\s*[-*+]\s+(.*)$/gm, '$1');
  // 保留有序列表的数字编号，不再去除 1. 2. 等
  // text = text.replace(/^\s*\d+\.\s+(.*)$/gm, '$1');
  // 表格竖线与分隔
  text = text.replace(/^\s*\|/gm, '');
  text = text.replace(/\|/g, ' ');
  text = text.replace(/^\s*[-|:]+\s*$/gm, '');
  // 强调、删除线符号
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');
  // 水平线
  text = text.replace(/^\s*([-*_]\s*){3,}$/gm, '');
  // 反斜杠转义
  text = text.replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, '$1');
  // 去除 HTML 标签
  text = text.replace(/<[^>]+>/g, '');
  // 空白规范化
  text = text.replace(/\u00A0/g, ' ');
  text = text.replace(/[\t ]+/g, ' ');
  text = text.replace(/\s*\n\s*/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

// ========== 修改说明兜底（简化版） ==========
function buildChangeNotesPlain(original: string, corrected: string): string {
  const a = sanitizeMarkdownPlain(original || '');
  const b = sanitizeMarkdownPlain(corrected || '');
  if (a === b) return '未检测到需要修改的内容';
  const delta = Math.abs(b.length - a.length);
  const before = a.slice(0, 60) + (a.length > 60 ? '…' : '');
  const after = b.slice(0, 60) + (b.length > 60 ? '…' : '');
  return `做了必要的ncorrectedContent与润色，提升用词准确性与语句流畅度。\n变更量(按长度估算): ${delta}\n示例:\n${before} -> ${after}`;
}

// ========== 兼容多种服务端出参（字段名可能变化） ==========
function getByPath(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object') return undefined;
  const segs = path.split('.');
  let cur: any = obj;
  for (const s of segs) {
    if (cur && typeof cur === 'object' && s in cur) {
      cur = (cur as any)[s];
    } else if (/^\d+$/.test(s) && Array.isArray(cur)) {
      cur = cur[Number(s)];
    } else {
      return undefined;
    }
  }
  return cur;
}
function deepFindByKeyIncludes(obj: any, aliases: string[]): any {
  try {
    const queue: any[] = [obj];
    const aliasSet = aliases.map(a => a.toLowerCase());
    while (queue.length) {
      const cur = queue.shift();
      if (cur && typeof cur === 'object') {
        for (const [k, v] of Object.entries(cur)) {
          if (typeof v === 'string') {
            const kl = k.toLowerCase();
            if (aliasSet.some(a => kl.includes(a)) && v.trim()) return v;
          } else if (v && typeof v === 'object') {
            queue.push(v);
          }
        }
      }
    }
  } catch {}
  return undefined;
}
function extractCorrectedText(resObj: any, fallback: string): string {
  const pathAliases = [
    // 常见直达路径
    'AI','corrected','correctedText','modified','text','content',
    'data.AI','data.corrected','data.correctedText','data.modified','data.text','data.content',
    'choices.0.message.content','result.text','result.content'
  ];
  for (const p of pathAliases) {
    const val = getByPath(resObj, p);
    if (typeof val === 'string' && val.trim()) return val;
  }
  // 退化为按键名模糊匹配
  const deep = deepFindByKeyIncludes(resObj, ['ai','correct','modif','revise','final','text','content','message']);
  if (typeof deep === 'string' && deep.trim()) return deep;
  return typeof fallback === 'string' ? fallback : JSON.stringify(fallback ?? '');
}
function extractChangeNotes(resObj: any): string | undefined {
  const pathAliases = [
    'explain','explanation','reason','analysis','changeNotes','changes','diff','comment',
    'data.explain','data.explanation','data.reason','data.analysis','data.changeNotes','data.changes','data.diff'
  ];
  for (const p of pathAliases) {
    const val = getByPath(resObj, p);
    if (typeof val === 'string' && val.trim()) return val;
  }
  const deep = deepFindByKeyIncludes(resObj, ['explain','reason','analysis','change','diff','comment']);
  if (typeof deep === 'string' && deep.trim()) return deep;
  return undefined;
}

// ========== 字段捷径：返回包含两个值的对象 ==========
basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'inputText': '待纠错文本',
        'correctedContent': '修改后的内容',
        'changeNotes': '修改说明',
      },
      'en-US': {
        'inputText': 'Text to Correct',
        'correctedContent': 'Corrected Content',
        'changeNotes': 'Change Notes',
      },
      'ja-JP': {
        'inputText': '校正するテキスト',
        'correctedContent': '修正後の内容',
        'changeNotes': '修正の説明',
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'inputText',
      label: t('inputText'),
      component: FieldComponent.Input,
      props: {
        placeholder: '请输入需要纠错的文本',
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'model',
      label: 'AI模型选择',
      component: FieldComponent.SingleSelect,
      props: {
        placeholder: '请选择AI模型',
        options: [
          { label: 'DeepSeek-V3', value: 'deepseek-v3' },
          { label: 'Doubao-Seed-1.6', value: 'doubao-seed-1.6' },
          { label: 'Doubao-1.5-pro-32k', value: 'doubao-1.5-pro-32k' },
          { label: '其他模型', value: 'custom' }
        ]
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'customModel',
      label: '其他模型的名称',
      component: FieldComponent.Input,
      props: {
        placeholder: '仅在模型选择其他模型时生效',
      }
    },
  ],
  // 定义捷径的返回结果类型 - 对象类型，包含两个字段
    resultType: {
      type: FieldType.Object,
      extra: {
        icon: {
          light: 'data:image/svg+xml;utf8,<svg t="1757255371543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6258" width="256" height="256"><path d="M763.744 240.576l-67.84-67.904-317.76 317.76-10.784 78.624 78.656-10.752z" fill="%233671FD" opacity=".2" p-id="6259"></path><path d="M787.904 198.976a64 64 0 0 1 0 90.496l-302.592 302.624a64 64 0 0 1-36.576 18.144l-115.2 15.776A16 16 0 0 1 315.52 608l15.776-115.2a64 64 0 0 1 18.144-36.576l302.624-302.592a64 64 0 0 1 90.496 0z m-45.248 45.152l-45.248-45.248-302.624 302.592-7.168 52.48 52.448-7.2z" fill="%233671FD" p-id="6260"></path><path d="M416.512 154.432a32 32 0 0 1 3.744 63.776l-3.744 0.224h-160a64 64 0 0 0-63.84 59.2l-0.16 4.8v480a64 64 0 0 0 59.2 63.84l4.8 0.16h512a64 64 0 0 0 63.84-59.2l0.16-4.8v-288a32 32 0 0 1 63.776-3.744l0.224 3.744v288a128 128 0 0 1-121.6 127.84l-6.4 0.16h-512a128 128 0 0 1-127.84-121.6l-0.16-6.4v-480a128 128 0 0 1 121.6-127.84l6.4-0.16z" fill="%233671FD" p-id="6261"></path><path d="M320.512 666.432h384a28.288 28.288 0 0 1 32 32 28.288 28.288 0 0 1-32 32h-384a28.288 28.288 0 0 1-32-32 28.288 28.288 0 0 1 32-32z" fill="%23FE9C23" p-id="6262"></path></svg>'
        },
        properties: [
           {
              key: 'correctedContent',
              label: t('correctedContent'),
              type: FieldType.Text,
              isGroupByKey: true,
              primary: true
            },
           {
             key: 'changeNotes',
             label: t('changeNotes'),
             type: FieldType.Text
           },
           {
             key: 'modelUsed',
             label: '使用的模型',
             type: FieldType.Text
           }
         ]
      }
    },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems
  execute: async (formItemParams: { inputText: string; model?: { label: string; value: string }; customModel?: string }, context) => {
    const { inputText = '', model, customModel } = formItemParams;
    
    // 处理模型选择逻辑：单选优先级最高，只有选择'其他模型'时才使用自定义模型名称
    let selectedModel = 'default';
    if (model?.value) {
      if (model.value === 'custom' && customModel?.trim()) {
        // 自定义模型：使用用户输入，保持用户大小写
        selectedModel = customModel.trim();
      } else if (model.value !== 'custom') {
        // 内置模型：与单选显示一致，优先使用 label（与 UI 文案完全一致）
        selectedModel = (model as any).label || model.value;
      }
    }
    
    console.log('Selected model:', selectedModel);
    
    // 清理输入文本
    const oClean = sanitizeMarkdownPlain(inputText);
    if (!oClean) {
      return {
        code: FieldCode.Success,
        data: {
          correctedContent: '',
          changeNotes: '输入文本为空'
        }
      };
    }
    
    try {
      // 调用飞书工具流接口进行文本纠错
      const requestUrl = 'https://open.feishu.cn/anycross/trigger/callback/MmMxMGIxZDJmMTMyYzdiMzBkNjcyNTRlZjc1YjA5MTUw' +
        '?message=' + encodeURIComponent(inputText) +
        '&model=' + encodeURIComponent(selectedModel);
      console.log('Request URL:', requestUrl);
      
      const resText: string = await context.fetch(requestUrl, {
        method: 'GET',
      }).then((r: any) => r.text());

      // 检查是否是HTML错误页面（如504错误）
      if (resText.trim().startsWith('<!DOCTYPE') || resText.trim().startsWith('<html')) {
        return {
          code: FieldCode.Success,
          data: {
            correctedContent: oClean,
            changeNotes: '接口暂时不可用，返回原文'
          }
        };
      }
      
      let resObj: any | undefined;
      try {
        resObj = JSON.parse(resText);
      } catch {}
      
      // 提取纠错后的内容
      const correctedRaw = resObj ? extractCorrectedText(resObj, resText) : resText;
      const correctedClean = sanitizeMarkdownPlain(correctedRaw);
      
      // 提取修改说明
      const serverNotesRaw = resObj ? extractChangeNotes(resObj) : undefined;
      const notes = serverNotesRaw 
        ? sanitizeMarkdownPlain(serverNotesRaw) 
        : buildChangeNotesPlain(oClean, correctedClean);
      
      return {
        code: FieldCode.Success,
        data: {
          correctedContent: correctedClean,
          changeNotes: notes,
          modelUsed: selectedModel
        }
      };

    } catch (e) {
      // 发生异常时避免在单元格报错，直接返回清理后的原文
      return {
        code: FieldCode.Success,
        data: {
          correctedContent: oClean,
          changeNotes: '处理过程中发生异常，返回原文',
          modelUsed: selectedModel
        }
      };
    }
  },
});

export default basekit;