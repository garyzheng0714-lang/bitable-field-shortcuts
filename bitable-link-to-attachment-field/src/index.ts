import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
import { Buffer } from 'buffer';

const { t } = field;

// 添加常用域名到白名单，支持更多文件下载源
basekit.addDomainList([
  'feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com',
  'github.com', 'githubusercontent.com', 'gitee.com',
  'raw.githubusercontent.com',
  'aliyuncs.com', 'qcloud.com', 'amazonaws.com', 'alicdn.com',
  'imgur.com', 'unsplash.com', 'pexels.com',
  'dropbox.com', 'onedrive.com', 'googledrive.com'
]);

basekit.addField({
  
  // 定义捷径的国际化语言资源
  i18n: {
    messages: {
      'zh-CN': {
        links_input_label: '附件下载链接',
        links_input_placeholder: '请输入包含下载链接的内容',
        separator_label: '链接分隔符',
        separator_placeholder: '多个链接的分隔符，如：换行符、逗号等',
        // existing_attachments_label: '已有附件（可选，用于合并）',
        // existing_attachments_label 已移除
        target_field_label: '目标附件字段',
        // 移除 links_field_label
        result_success_label: '处理成功',
        result_count_label: '附件数量',
        result_status_label: '处理状态',
        error_no_links: '未找到有效的下载链接',
        error_download_failed: '文件下载失败',
        error_invalid_url: '无效的链接格式',
        tip_limit_5: '最多生成 5 个附件，单个附件大小≤10MB。超过部分将忽略，或请在工作流捷径中调用，',
        tutorial_link_text: '点此查看教程',
      },
      'en-US': {
        links_input_label: 'Attachment Download Links',
        links_input_placeholder: 'Enter content containing download links',
        separator_label: 'Link Separator',
        separator_placeholder: 'Separator for multiple links, e.g.: newline, comma, etc.',
        target_field_label: 'Target Attachment Field',
        // remove links_field_label
        result_success_label: 'Processing Success',
        result_count_label: 'Attachment Count',
        result_status_label: 'Processing Status',
        error_no_links: 'No valid download links found',
        error_download_failed: 'File download failed',
        error_invalid_url: 'Invalid URL format',
        tip_limit_5: 'Up to 5 attachments can be generated, each ≤10MB. Extra links will be ignored or please run in batches.',
        tutorial_link_text: 'See tutorial',
      },
      'ja-JP': {
        links_input_label: '添付ファイルダウンロードリンク',
        links_input_placeholder: 'ダウンロードリンクを含むコンテンツを入力してください',
        separator_label: 'リンク区切り文字',
        separator_placeholder: '複数リンクの区切り文字、例：改行、カンマなど',
        target_field_label: 'ターゲット添付ファイルフィールド',
        // remove links_field_label
        result_success_label: '処理成功',
        result_count_label: '添付ファイル数',
        result_status_label: '処理ステータス',
        error_no_links: '有効なダウンロードリンクが見つかりません',
        error_download_failed: 'ファイルのダウンロードに失敗しました',
        error_invalid_url: '無効なURL形式',
        tip_limit_5: '最大5件の添付を生成できます（各≤10MB）。超過分は無視されるか、分割して実行してください。',
        tutorial_link_text: 'チュートリアルを見る',
      },
    },
  },
  
  // 定义捷径的输入参数表单
  formItems: [
    {
      key: 'linksInput',
      label: t('links_input_label'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('links_input_placeholder'),
        multiline: true, // 支持多行输入
      },
      tooltips: [
        { type: 'text', content: t('tip_limit_5') },
        { type: 'link', text: t('tutorial_link_text'), link: 'https://foodtalks.feishu.cn/docx/PIBcdMI54oysWtxhooWcdfZYnib?from=from_copylink' },
      ],
      validator: {
        required: true,
      },
    },
    {
      key: 'separator',
      label: t('separator_label'),
      component: FieldComponent.Input,
      props: {
        placeholder: t('separator_placeholder'),
      },
      defaultValue: '', // 分隔符可留空，将自动从文本中提取 URL
      validator: {
        required: false,
      },
    },
    // 移除 linksField: FieldSelect
  ],
  
  // 主要执行逻辑
  execute: async (formItemParams: any, context) => {
    let { linksInput, separator } = formItemParams;

    // 处理可能的对象类型输入（针对多行输入）
    if (typeof linksInput !== 'string') {
      const obj: any = linksInput as any;
      if (obj && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'value')) {
        linksInput = String(obj.value ?? '');
      } else if (Array.isArray(obj)) {
        const flattened = obj
          .map((item: any) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && Object.prototype.hasOwnProperty.call(item, 'value')) {
              return String(item.value ?? '');
            }
            return '';
          })
          .filter((s: string) => s && s.trim());
        linksInput = flattened.join('\n');
      } else {
        linksInput = String(obj ?? '');
      }
    }
    
    /** 调试日志函数 */
    function debugLog(step: string, data: any) {
      console.log(JSON.stringify({
        step,
        timestamp: new Date().toISOString(),
        data,
        formItemParams: { 
          linksInput: typeof linksInput === 'string' ? (linksInput.length > 100 ? linksInput.substring(0, 100) + '...' : linksInput) : (typeof linksInput === 'object' ? JSON.stringify(linksInput) : String(linksInput)), 
          separator,
        }
      }));
    }
    
    try {
      // 类型安全检查：确保 linksInput 是字符串
      if (typeof linksInput !== 'string') {
        debugLog('1-类型错误', { inputType: typeof linksInput, message: 'linksInput 必须是字符串类型' });
        return {
          code: FieldCode.Error,
          message: 'Invalid input type: linksInput must be a string',
        };
      }
      
      debugLog('1-开始处理', { inputLength: linksInput.length });
      
      // 1. 解析链接：根据分隔符分割输入内容
      const combinedText = (linksInput || '').toString();

      if (!combinedText.trim()) {
        debugLog('1-输入为空', { message: '未找到有效的下载链接' });
        return {
          code: FieldCode.Success,
          data: [], // 返回空的附件数组
        };
      }
      
      // 处理分隔符：支持常见的转义字符和多种分隔符
      const normalizeSep = (s?: string) => {
        if (!s) return '';
        if (s === '\\n') return '\n';
        if (s === '\\t') return '\t';
        if (s === '\\r') return '\r';
        return s;
      };
      const actualSeparator = normalizeSep(separator);
      let rawLinks: string[] = [];
      // 将常见分隔符（英文逗号、中文逗号、分号等）视为 URL 结束符
      const urlPattern = /https?:\/\/[^\s'"\\,，;；)）\]]+/g;
      const extracted = combinedText.match(urlPattern);
      if (extracted && extracted.length > 0) {
        rawLinks = extracted
          .flatMap((s) => s.split(/[，,;；\n\t\r]+/))
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
      } else if (actualSeparator) {
        // 回退：用户提供了分隔符但未提取到 URL，按分隔符切分
        rawLinks = combinedText.split(actualSeparator)
          .map(link => link.trim())
          .filter(link => link.length > 0);
      } else {
        // 无分隔符也未命中 URL，尝试按常见分隔符集合切分
        const commonSeps = ['\n', ',', '，', ';', '；', ' ', '\t'];
        rawLinks = commonSeps
          .reduce<string[]>((acc, sep) => acc.length ? acc : combinedText.split(sep), [])
          .map(link => link.trim())
          .filter(link => link.length > 0);
      }

      // 进一步清理：移除每个链接末尾的逗号或其他标点符号
      rawLinks = rawLinks.map(link => link.replace(/[,，;；\s]+$/, '')).filter(link => link.length > 0);
      
      debugLog('2-链接分割完成', { rawLinksCount: rawLinks.length, separator: actualSeparator });
      
      // 放宽 URL 校验：正则已确保 http(s) 开头，这里直接使用
      const validLinks: string[] = rawLinks.filter(link => link.startsWith('http://') || link.startsWith('https://'));
      
      if (validLinks.length === 0) {
        debugLog('4-无有效链接', { message: '无效的链接格式' });
        return {
          code: FieldCode.Success,
          data: [], // 返回空的附件数组
        };
      }
      
      debugLog('4-有效链接筛选完成', { validLinksCount: validLinks.length });
      
      // 3. 构建“新”附件
      const toAttachment = (url: string) => {
        let name = 'file';
        try {
          const u = new URL(url);
          const last = u.pathname.substring(u.pathname.lastIndexOf('/') + 1) || 'file';
          const clean = last.split('?')[0].split('#')[0] || last;
          name = decodeURIComponent(clean) || 'file';
        } catch {}
        if (!/\.[A-Za-z0-9]{1,8}$/.test(name)) {
          name = `${name}.bin`;
        }
        return { name, content: url, contentType: 'attachment/url' as const };
      };

      const newAttachments = validLinks.map(toAttachment);

      // 4. 去重并限制最多 5 个
      const maxCount = 5;
      const results: { name: string; content: string; contentType: 'attachment/url' }[] = [];
      const seen = new Set<string>();
      for (const att of newAttachments) {
        if (results.length >= maxCount) break;
        if (!seen.has(att.content)) {
          seen.add(att.content);
          results.push(att);
        }
      }

      debugLog('5-已构建附件返回', { resultCount: results.length });
      return {
        code: FieldCode.Success,
        data: results,
      };
      
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message; else message = String(error);
      debugLog('X-异常', { message });
      return {
        code: FieldCode.Error,
        message,
      };
    }
  },
  
  // 声明返回字段类型：附件
  resultType: {
    type: FieldType.Attachment,
  },
});

export default basekit;
