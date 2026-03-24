const { basekit, FieldType, field, FieldComponent, FieldCode } = require('@lark-opdev/block-basekit-server-api');

const { t } = field;

// 仅使用平台提供的 fetch 与纯字符串处理，彻底移除所有第三方 ESM 依赖（jsdom/readability/article-extractor/turndown）。
// 这样可确保构建产物完全为 CommonJS，避免 Feishu VM 出现 “'import' and 'export' may appear only with 'sourceType: module'”。

// 协议相对 src 修正
const PROTOCOL_RELATIVE_SRC_RE = /src=["']\/\/([^"']+)["']/gi;

// 简单 Markdown 规范化（去除多余空行，结尾换行）
function normalizeMarkdown(md: string): { title: string; markdown: string } {
  const s = (md || '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  // 如果第一行是 Markdown 的 H1，抽出为 title
  const m = s.match(/^\s*#\s+(.+?)\s*$/m);
  const title = m ? m[1].trim() : '';
  return { title, markdown: s };
}

// 修正微信公众号图片链接到 HTTPS，并通过 images.weserv.nl 代理绕过防盗链（保留 GIF 动画）
function fixWeChatImageUrls(markdown: string): string {
  let output = (markdown || '').replace(/http:\/\/(?:[\w.-]*\.)?(?:mmbiz\.qpic\.cn|qpic\.cn|wx\.qlogo\.cn|mmbiz\.qlogo\.cn)/gi, (m) => m.replace(/^http:/i, 'https:'));
  const wechatImgRe = /https?:\/\/(?:[\w.-]*\.)?(?:mmbiz\.qpic\.cn|qpic\.cn|wx\.qlogo\.cn|mmbiz\.qlogo\.cn)[^\s)>'\"]+/gi;
  output = output.replace(wechatImgRe, (m) => {
    const httpsUrl = m.replace(/^http:/i, 'https:');
    const isGif = /\.(gif)(?:$|[?&#])/i.test(httpsUrl) || /[?&]wx_fmt=gif\b/i.test(httpsUrl) || /\/mmbiz_gif\//i.test(httpsUrl);
    
    // 优化图片参数：移除可能导致加载失败的参数
    let cleanUrl = httpsUrl.replace(/[?&]watermark=\d+/g, '').replace(/[?&]tp=webp/g, '');
    
    // 使用多个代理服务提高可用性
    const base = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=800&q=85`;
    return isGif ? `${base}&output=gif&n=-1` : base;
  });
  return output;
}

function stripTags(x: string): string {
  return (x || '').replace(/<[^>]+>/g, '').replace(/\u00A0/g, ' ').trim();
}
function getAttr(attrs: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i');
  const m = attrs.match(re);
  if (m && m[1]) return m[1];
  const re2 = new RegExp(`${name}\\s*=\\s*'([^']*)'`, 'i');
  const m2 = attrs.match(re2);
  if (m2 && m2[1]) return m2[1];
  const re3 = new RegExp(`${name}\\s*=\\s*([^\s"'>]+)`, 'i');
  const m3 = attrs.match(re3);
  return m3 && m3[1] ? m3[1] : null;
}
function decodeBasicEntities(s: string): string {
  return (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function isWeChatUrl(u: string): boolean {
  return /(^|\/)\/mp\.weixin\.qq\.com\//i.test(u);
}

// 极简 HTML -> Markdown（不依赖第三方库，尽量稳妥）
function htmlToMarkdownLite(html: string): string {
  if (!html) return '';
  let s = html;
  // 去掉脚本/样式
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
       .replace(/<style[\s\S]*?<\/style>/gi, '');
  // 换行标签
  s = s.replace(/<br\s*\/?>(?=\s*\n?)/gi, '\n');
  // 标题
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `\n# ${stripTags(c)}\n`)
       .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `\n## ${stripTags(c)}\n`)
       .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `\n### ${stripTags(c)}\n`)
       .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `\n#### ${stripTags(c)}\n`)
       .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, c) => `\n##### ${stripTags(c)}\n`)
       .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, c) => `\n###### ${stripTags(c)}\n`);
  // 图片：data-src/data-original/src，协议相对 -> https
  s = s.replace(/<img([^>]*)>/gi, (m, attrs) => {
    let src = getAttr(attrs, 'data-src') || getAttr(attrs, 'data-original') || getAttr(attrs, 'src') || '';
    if (!src) return '';
    src = src.replace(/^\/\//, 'https://');
    const alt = getAttr(attrs, 'alt') || '';
    return `![${alt}](${src})`;
  });
  // 链接
  s = s.replace(/<a\s+([^>]+)>([\s\S]*?)<\/a>/gi, (_, attrs, text) => {
    const href = getAttr(attrs, 'href') || '';
    const label = stripTags(text);
    if (!href) return label;
    return `[${label}](${href})`;
  });
  // 段落/列表换行
  s = s.replace(/<\/(p|div|li|section|article)>/gi, '\n');
  // 规范化 img 协议相对
  s = s.replace(PROTOCOL_RELATIVE_SRC_RE, 'src="https://$1"');
  // 去除剩余标签
  s = stripTags(s);
  // 基础 HTML 实体解码（常见几项）
  s = decodeBasicEntities(s);
  return s;
}

// 解析 r.jina.ai 的纯文本格式：Title/URL/Published/Markdown Content
function parseJinaPlainText(text: string): { title: string; markdown: string } {
  let title = '';
  const titleM = text.match(/^\s*Title:\s*(.+)$/m);
  if (titleM) title = titleM[1].trim();
  const mark = 'Markdown Content:';
  const i = text.indexOf(mark);
  let markdown = '';
  if (i >= 0) {
    markdown = text.slice(i + mark.length).replace(/^\s+/, '');
  } else {
    markdown = text;
  }
  return { title, markdown };
}

function isPoorMarkdown(md: string): boolean {
  const noise = [/热门搜索/, /登录/, /注册/, /扫码关注/, /隐私/, /关于/, /导航/];
  const hits = noise.reduce((c, re) => c + (re.test(md) ? 1 : 0), 0);
  const paras = (md.match(/\n\n/g) || []).length;
  return hits >= 3 && paras < 8;
}

function extractTitleFromHTML(html: string): string {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (og && og[1]) return decodeBasicEntities(stripTags(og[1]));
  const nt = html.match(/<meta[^>]+name=["']title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (nt && nt[1]) return decodeBasicEntities(stripTags(nt[1]));
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1 && h1[1]) return decodeBasicEntities(stripTags(h1[1]));
  const tt = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (tt && tt[1]) return decodeBasicEntities(stripTags(tt[1]));
  return '';
}

function extractWeChatMain(html: string): string | null {
  const m1 = html.match(/<div[^>]+id=["']js_content["'][^>]*>([\s\S]*?)<\/div>/i);
  if (m1) return m1[1];
  const m2 = html.match(/<div[^>]+class=["'][^"']*rich_media_content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (m2) return m2[1];
  return null;
}

// DOM 节点结构表示
interface DOMNode {
  tag: string;
  attrs: { [key: string]: string };
  text: string;
  children: DOMNode[];
  parent?: DOMNode;
}

// 解析 HTML 为简化的 DOM 树
function parseHTML(html: string): DOMNode {
  // 简化的 HTML 解析器，处理嵌套标签
  const root: DOMNode = { tag: 'root', attrs: {}, text: '', children: [] };
  const stack: DOMNode[] = [root];
  
  // 预处理：移除脚本、样式、注释
  let cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
  
  // 简单的标签匹配和解析
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  let lastIndex = 0;
  let match;
  
  while ((match = tagRegex.exec(cleaned)) !== null) {
    const current = stack[stack.length - 1];
    
    // 添加标签前的文本内容
    if (match.index > lastIndex) {
      const textContent = cleaned.slice(lastIndex, match.index).trim();
      if (textContent) {
        current.text += textContent + ' ';
      }
    }
    
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    
    if (fullTag.startsWith('</')) {
      // 结束标签
      if (stack.length > 1 && stack[stack.length - 1].tag === tagName) {
        stack.pop();
      }
    } else {
      // 开始标签
      const attrs: { [key: string]: string } = {};
      const attrRegex = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*["']([^"']*)["']/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(fullTag)) !== null) {
        attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
      }
      
      const node: DOMNode = {
        tag: tagName,
        attrs,
        text: '',
        children: [],
        parent: current
      };
      
      current.children.push(node);
      
      // 自闭合标签不需要入栈
      if (!fullTag.endsWith('/>') && !['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName)) {
        stack.push(node);
      }
    }
    
    lastIndex = tagRegex.lastIndex;
  }
  
  // 添加剩余文本
  if (lastIndex < cleaned.length) {
    const textContent = cleaned.slice(lastIndex).trim();
    if (textContent) {
      stack[stack.length - 1].text += textContent;
    }
  }
  
  return root;
}

// 计算节点的文本密度和内容质量分数
function calculateContentScore(node: DOMNode): number {
  const text = getNodeText(node).trim();
  const textLength = text.length;
  
  if (textLength < 20) return 0;
  
  let score = textLength;
  
  // 基于标签类型的权重
  const tagWeights: { [key: string]: number } = {
    'p': 1.0,
    'div': 0.8,
    'article': 1.5,
    'section': 1.2,
    'main': 1.5,
    'h1': 0.8, 'h2': 0.8, 'h3': 0.8, 'h4': 0.8, 'h5': 0.8, 'h6': 0.8,
    'li': 0.9,
    'blockquote': 1.1,
    'pre': 0.7,
    'code': 0.5,
    'span': 0.6,
    'a': 0.3,
    'nav': 0.1,
    'header': 0.1,
    'footer': 0.1,
    'aside': 0.1
  };
  
  score *= (tagWeights[node.tag] || 0.5);
  
  // 基于 class 和 id 的启发式评分
  const className = (node.attrs.class || '').toLowerCase();
  const id = (node.attrs.id || '').toLowerCase();
  const combined = className + ' ' + id;
  
  // 正面指标
  const positivePatterns = [
    /\b(content|article|post|entry|main|body|text|story|news)\b/,
    /\b(detail|description|summary|excerpt)\b/,
    /\b(blog|editorial|column)\b/
  ];
  
  // 负面指标
  const negativePatterns = [
    /\b(nav|menu|sidebar|footer|header|ad|advertisement|banner)\b/,
    /\b(comment|reply|social|share|tag|category|related)\b/,
    /\b(widget|plugin|popup|modal|overlay)\b/,
    /\b(login|register|subscribe|newsletter)\b/
  ];
  
  for (const pattern of positivePatterns) {
    if (pattern.test(combined)) score *= 1.3;
  }
  
  for (const pattern of negativePatterns) {
    if (pattern.test(combined)) score *= 0.3;
  }
  
  // 文本质量评估
  const sentences = text.split(/[.!?。！？]/).filter(s => s.trim().length > 10);
  const avgSentenceLength = sentences.length > 0 ? textLength / sentences.length : 0;
  
  // 理想的句子长度在 20-100 字符之间
  if (avgSentenceLength >= 20 && avgSentenceLength <= 100) {
    score *= 1.2;
  } else if (avgSentenceLength < 10 || avgSentenceLength > 200) {
    score *= 0.7;
  }
  
  // 链接密度惩罚
  const linkCount = (text.match(/https?:\/\/[^\s]+/g) || []).length;
  const linkDensity = linkCount / Math.max(textLength / 100, 1);
  if (linkDensity > 0.3) {
    score *= Math.max(0.2, 1 - linkDensity);
  }
  
  // 标点符号密度
  const punctuationCount = (text.match(/[,.!?;:，。！？；：]/g) || []).length;
  const punctuationDensity = punctuationCount / Math.max(textLength / 100, 1);
  if (punctuationDensity >= 2 && punctuationDensity <= 8) {
    score *= 1.1;
  }
  
  return score;
}

// 获取节点的所有文本内容
function getNodeText(node: DOMNode): string {
  let text = node.text || '';
  for (const child of node.children) {
    text += ' ' + getNodeText(child);
  }
  return text.replace(/\s+/g, ' ').trim();
}

// 将节点转换回 HTML
function nodeToHTML(node: DOMNode): string {
  if (node.tag === 'root') {
    return node.children.map(child => nodeToHTML(child)).join('');
  }
  
  const attrs = Object.entries(node.attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  const attrStr = attrs ? ` ${attrs}` : '';
  const childrenHTML = node.children.map(child => nodeToHTML(child)).join('');
  const textContent = node.text || '';
  
  if (['img', 'br', 'hr', 'input', 'meta', 'link'].includes(node.tag)) {
    return `<${node.tag}${attrStr}>${textContent}`;
  }
  
  return `<${node.tag}${attrStr}>${textContent}${childrenHTML}</${node.tag}>`;
}

function extractMainHTML(html: string): string {
  // 解析 HTML 为 DOM 树
  const dom = parseHTML(html);
  
  // 收集所有可能的内容候选节点
  const candidates: { node: DOMNode; score: number }[] = [];
  
  function collectCandidates(node: DOMNode) {
    // 跳过明显的非内容区域
    const skipTags = ['script', 'style', 'nav', 'header', 'footer', 'aside', 'noscript'];
    if (skipTags.includes(node.tag)) return;
    
    const text = getNodeText(node);
    if (text.length >= 100) { // 只考虑有足够文本的节点
      const score = calculateContentScore(node);
      candidates.push({ node, score });
    }
    
    // 递归处理子节点
    for (const child of node.children) {
      collectCandidates(child);
    }
  }
  
  collectCandidates(dom);
  
  if (candidates.length === 0) {
    // 回退到原始方法
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return body ? body[1] : html;
  }
  
  // 按分数排序，选择最佳候选
  candidates.sort((a, b) => b.score - a.score);
  
  // 选择最高分的节点，但要避免选择过于宽泛的容器
  let bestCandidate = candidates[0];
  
  // 如果最高分节点包含的文本过多，可能是整个页面，尝试找更精确的子节点
  const bestText = getNodeText(bestCandidate.node);
  if (bestText.length > 10000 && candidates.length > 1) {
    // 查找分数相近但文本更合理的候选
    for (let i = 1; i < Math.min(5, candidates.length); i++) {
      const candidate = candidates[i];
      const candidateText = getNodeText(candidate.node);
      
      if (candidateText.length >= 500 && candidateText.length <= 8000 && 
          candidate.score >= bestCandidate.score * 0.7) {
        bestCandidate = candidate;
        break;
      }
    }
  }
  
  return nodeToHTML(bestCandidate.node);
}

basekit.addDomainList([
  // 飞书相关域名
  'feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com',
  // 图片代理服务
  'images.weserv.nl', 'wsrv.nl',
  // 内容解析服务
  'jina.ai', 'r.jina.ai', 's.jina.ai',
  // 微信相关
  'mp.weixin.qq.com', 'weixin.qq.com',
  // 食品行业媒体网站
  'foodtalks.cn', 'www.foodtalks.cn',
  'foodaily.com', 'www.foodaily.com',
  'food-safety.com', 'www.food-safety.com',
  'foodmate.net', 'www.foodmate.net',
  'cnfood.cn', 'www.cnfood.cn',
  'foodjx.com', 'www.foodjx.com',
  'spzs.com', 'www.spzs.com',
  'foodqs.cn', 'www.foodqs.cn',
  'foodpartner.com', 'www.foodpartner.com',
  'foodbevdaily.com', 'www.foodbevdaily.com',
  'foodindustry.com', 'www.foodindustry.com',
  'foodprocessing.com', 'www.foodprocessing.com',
  'foodnavigator.com', 'www.foodnavigator.com',
  'foodnavigator-asia.com', 'www.foodnavigator-asia.com',
  'nutraingredients.com', 'www.nutraingredients.com',
  'nutraingredients-asia.com', 'www.nutraingredients-asia.com',
  // 通用新闻媒体（有时转载食品新闻）
  '36kr.com', 'www.36kr.com',
  'sina.com.cn', 'www.sina.com.cn',
  'sohu.com', 'www.sohu.com',
  '163.com', 'www.163.com',
  'qq.com', 'www.qq.com',
  'people.com.cn', 'xinhuanet.com', 'www.xinhuanet.com',
  'chinanews.com', 'www.chinanews.com',
  // 通用内容站点
  'github.com', 'medium.com', 'wikipedia.org'
]);

basekit.addField({
  i18n: {
    messages: {
      'zh-CN': {
        url_input_label: '网页链接',
        url_input_placeholder: '填入文章链接，支持微信公众号文章',
        error_no_url: '未提供有效的网页链接',
        error_fetch_failed: '网页获取失败',
        error_parse_failed: '网页解析失败',
        tip_supported_sites: '自动提取网页正文内容并转换为 Markdown 格式，可配合Markdown预览插件使用，',
        tutorial_link_text: '查看使用教程',
      },
      'en-US': {
        url_input_label: 'Web Page URL',
        url_input_placeholder: 'Enter the web page URL to extract content from',
        error_no_url: 'No valid web page URL provided',
        error_fetch_failed: 'Failed to fetch web page',
        error_parse_failed: 'Failed to parse web page',
        tip_supported_sites: 'Automatically extract web page content and convert to Markdown format',
        tutorial_link_text: 'View Tutorial',
      },
    },
  },
  formItems: [
    {
      key: 'urlInput',
      label: t('url_input_label'),
      component: FieldComponent.Input,
      props: { placeholder: t('url_input_placeholder') },
      tooltips: [
        { type: 'text', content: t('tip_supported_sites') },
        { type: 'link', text: t('tutorial_link_text'), link: 'https://foodtalks.feishu.cn/wiki/S8azw3cZRib6jEkBVbMcOixXnkh?from=from_copylink' },
      ],
      validator: { required: true },
    },
  ],
  execute: async (formItemParams: any, context) => {
    let { urlInput } = formItemParams;
    if (typeof urlInput !== 'string') {
      const obj: any = urlInput as any;
      if (obj && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'value')) {
        urlInput = String(obj.value ?? '');
      } else {
        urlInput = String(obj ?? '');
      }
    }
    const url = (urlInput || '').trim();
    if (!url) {
      return { code: FieldCode.Error, message: t('error_no_url') };
    }
    if (!/^https?:\/\//i.test(url)) {
      return { code: FieldCode.Error, message: 'URL必须以http://或https://开头' };
    }

    try {
      // 方案 A：优先使用 r.jina.ai（若质量差则回退）
      try {
        const rUrl = `https://r.jina.ai/${url}`;
        const resp = await context.fetch(rUrl, {
            method: 'GET',
            headers: { 'Accept': 'text/plain, */*;q=0.8', 'User-Agent': 'Mozilla/5.0 (ReaderFetcher)' }
          });
        if (resp.ok) {
          const text = await resp.text();
          if (text && text.length > 100) {
            // r.jina.ai 通常包含 Title/Markdown Content 结构
            const parsed = parseJinaPlainText(text);
            const titleA = parsed.title || '';
            const mdA = parsed.markdown;
            if (mdA && mdA.length > 200) {
              return { code: FieldCode.Success, data: combineOutput(titleA, mdA) };
            }
          }
        }
      } catch {}

      // 方案 B：兜底 - 抓取 HTML 再用 lite 提取主内容并转 Markdown
      if (isWeChatUrl(url)) {
        // 微信使用 s.jina.ai 规避直抓困难
        try {
          const sUrl = `https://s.jina.ai/${url}`;
          const resp = await context.fetch(sUrl, {
            method: 'GET',
            headers: { 'Accept': 'text/html, */*;q=0.8', 'User-Agent': 'Mozilla/5.0 (ReaderFetcher)' }
          });
          if (resp.ok) {
            let html = await resp.text();
            if (html && html.length > 200) {
              html = html.replace(/<img([^>]+)data-src="([^"]+)"([^>]*)>/gi, '<img$1src="$2"$3>')
                         .replace(/<img([^>]+)data-original="([^"]+)"([^>]*)>/gi, '<img$1src="$2"$3>')
                         .replace(PROTOCOL_RELATIVE_SRC_RE, 'src="https://$1"');
              const main = extractWeChatMain(html) || html;
              const md = htmlToMarkdownLite(main);
              const title = extractTitleFromHTML(html);
              const combined = combineOutput(title, md);
              const processed = postProcessMarkdown(combined, url);
              return { code: FieldCode.Success, data: processed };
            }
          }
        } catch (err) {
          // s.jina.ai 失败时静默继续到下一个方案
        }
      }

      // 非微信直抓
      try {
        const raw = await context.fetch(url, {
          method: 'GET',
          headers: { 'Accept': 'text/html, */*;q=0.8', 'User-Agent': 'Mozilla/5.0 (ReaderFetcher)' }
        });
        if (raw.ok) {
          const html = await raw.text();
          if (html && html.length > 200) {
            const main = extractMainHTML(html);
            const md = htmlToMarkdownLite(main);
            const title = extractTitleFromHTML(html);
            const combined = combineOutput(title, md);
            const processed = postProcessMarkdown(combined, url);
            return { code: FieldCode.Success, data: processed };
          }
        }
      } catch {}

      return { code: FieldCode.Error, message: t('error_parse_failed') };
    } catch (e: any) {
       const msg = e && e.message ? e.message : 'unknown';
       return { code: FieldCode.Error, message: `${t('error_fetch_failed')}: ${msg}` };
     }
   },
   resultType: {
     type: FieldType.Text,
   }
});

module.exports = basekit;

function combineOutput(title: string, md: string): string {
  const body0 = (md || '').replace(/\n{3,}/g, '\n\n').trim();
  const cleanSiteSuffix = (s: string) => (s || '')
    .replace(/\s*[-–—|｜·•]\s*(FoodTalks全球食品资讯网?|FoodTalks|全球食品资讯)\s*$/i, '')
    .replace(/[\s\-–—|｜·•]+$/g, '')
    .trim();
  const t0 = cleanSiteSuffix((title || '').trim());

  const findBodyTitle = (s: string) => {
    const lines = s.split('\n');
    const max = Math.min(lines.length, 40);
    for (let i = 0; i < max; i++) {
      const m = lines[i].match(/^\s*#{1,3}\s+(.+)\s*$/);
      if (m) {
        const tt = cleanSiteSuffix(m[1].trim());
        if (tt && tt !== '目录') return tt;
      }
    }
    return '';
  };

  const firstLine = body0.split('\n', 1)[0] || '';
  const bodyTitle = findBodyTitle(body0);
  const finalTitle = (t0 && t0 !== '目录') ? t0 : bodyTitle;

  if (finalTitle) {
    // 若正文首行已是相同标题，则将其规格化为二级标题，避免重复插入
    const mFirst = firstLine.match(/^\s*#{1,6}\s+(.+)\s*$/);
    if (mFirst) {
      const ft = cleanSiteSuffix((mFirst[1] || '').trim());
      if (ft === finalTitle) {
        const bodyFixed = body0.replace(/^\s*#{1,6}\s+.+$/m, `## ${finalTitle}`);
        return `${bodyFixed}\n`;
      }
    }
    return `## ${finalTitle}\n\n${body0}\n`;
  }
  return `${body0}\n`;
}

// 噪音清理与图片修复的统一后处理
function postProcessMarkdown(md: string, url: string): string {
  let s = (md || '').replace(/\r\n?/g, '\n');

  // 微信图片统一修复（若 URL 为微信或正文内包含微信图床）
  if (isWeChatUrl(url) || /mmbiz\.(?:qpic|qlogo)\.cn|wx\.qlogo\.cn/i.test(s)) {
    s = fixWeChatImageUrls(s);
  }

  const lines = s.split('\n');

  // 顶部进一步过滤：联系方式/推广/导师简介等（最多前 20 行）
  const PHONE_RE = /(?:\+?86[- ]?)?(1[3-9]\d{9})\b/;
  const CONTACT_RE = /(微信同号|加微|VX|v信|WeChat|电话|联系电话|咨询|联系我|添加微信|扫码加)/i;
  const PROMO_RE = /(学历提升指导师|升本指导|报考指导|辅导老师|导师|顾问)/;
  const STAR_DIGITS_RE = /^(?:\*{2}\d+\*{2}\s*){2,}$/; // 如 **0****1**
  let idx = 0;
  const maxTrimHead = Math.min(lines.length, 20);
  while (idx < maxTrimHead) {
    const l = (lines[idx] || '').trim();
    if (!l) { idx++; continue; }
    if (STAR_DIGITS_RE.test(l)) { idx++; continue; }
    if ((PHONE_RE.test(l) && CONTACT_RE.test(l)) || PROMO_RE.test(l)) { idx++; continue; }
    // "老师 + (微信同号)" 之类
    if (/老师/.test(l) && (CONTACT_RE.test(l) || PHONE_RE.test(l))) { idx++; continue; }
    break;
  }
  if (idx > 0) {
    lines.splice(0, idx);
  }

  // 工具：判断是否为纯图片行，提取图片 URL，判断是否为社交/站点图标类图片
  function isPureImageLine(line: string): boolean {
    return /^\s*!\[[^\]]*\]\(([^)]+)\)\s*$/.test(line);
  }
  function extractImageUrl(line: string): string {
    const m = line.match(/!\[[^\]]*\]\(([^)]+)\)/);
    return m ? m[1] : '';
  }
  function isSocialIconUrl(u: string): boolean {
    if (!u) return false;
    const low = u.toLowerCase();
    // 常见 icon/logo/share/svg 等图标资源，或社交平台图标
    if (/\.(svg|webp)(?:$|[?#])/.test(low)) return true;
    return /(logo|icon|share|home-share|favicon|sprite|qrcode|qr|avatar|author|default-author|profile|weibo|weixin|wechat|qq|qzone|douyin|toutiao|x\.com|twitter|facebook|instagram|linkedin|bilibili|xiaohongshu)/i.test(u);
  }

  // 去掉顶部面包屑/导航/社交图标（最多前 10 行）
  let startIdx = 0;
  const maxHead = Math.min(lines.length, 10);
  const crumbRe = /(首页|当前位置|面包屑|导航|您现在的位置|位置)/;
  const sepRe = />|»|›|\||｜|\/|\\/;
  while (startIdx < maxHead) {
    const l = (lines[startIdx] || '').trim();
    if (!l) { startIdx++; continue; }
    if (l.length <= 80 && crumbRe.test(l) && sepRe.test(l)) { startIdx++; continue; }
    // 明显社交/登录行
    if (/登录|注册|扫码|关注我们|分享|分享到|QQ|微信|微博|知乎|APP\s*下载|下载客户端|打开APP/i.test(l)) { startIdx++; continue; }
    // 顶部纯图标图片（站点 logo / 分享按钮等）
    if (isPureImageLine(l)) {
      const imgUrl = extractImageUrl(l);
      if (isSocialIconUrl(imgUrl)) { startIdx++; continue; }
    }
    // 纯分隔线
    if (/^[-–—\s_|·•]{4,}$/.test(l)) { startIdx++; continue; }
    break;
  }

  // 行级噪音过滤
  const kept: string[] = [];
  const actionReShort = /^(赞|点赞|在看|分享|转发|收藏|评论|打赏|投票|阅读|阅读量|阅读数|关注|订阅)(（?\d+）?)?$/;
  const noiseLine = /(责任编辑|本文作者|声明[:：]|版权[:：]?|联系我们|关于我们|隐私政策|用户协议|广告|商务合作|举报|收藏|返回顶部|目录[:：]?|打赏|赞助|长按识别|二维码|扫码关注|分享到|分享至|预览时标签不可点|继续滑动看下一个|轻触阅读原文|微信扫一扫|关注该公众号|使用小程序|打开APP|知道了|允许|取消|留言|听过|登录[^\n]*参与评论|这里空空如也|好文章，需要你的鼓励)/i;
  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i];
    const lt = l.trim();

    if (!lt) { kept.push(''); continue; }

    // 顶部宣传/联系方式：电话+微信同号/导师/老师等
    if (STAR_DIGITS_RE.test(lt)) continue;
    if ((PHONE_RE.test(lt) && CONTACT_RE.test(lt)) || PROMO_RE.test(lt)) continue;
    if (/老师/.test(lt) && (CONTACT_RE.test(lt) || PHONE_RE.test(lt))) continue;

    // 单独的操作按钮短行（赞/分享/在看/评论等）
    if (actionReShort.test(lt)) continue;
    if (lt.length <= 14 && /(赞|点赞|在看|分享|转发|收藏|评论)/.test(lt)) continue;

    if (noiseLine.test(lt)) continue;

    // 去掉含 javascript: 的伪链接
    if (/\(javascript:/.test(lt)) continue;

    // 单个"×"关闭按钮
    if (lt === '×') continue;

    // 纯一位数字（评论/点赞计数）
    if (/^[0-9]$/.test(lt)) continue;

    // 去掉纯链接导航式长行
    if (lt.length < 120 && /\bhttps?:\/\//.test(lt) && /\s{0,3}[|｜·•]/.test(lt)) continue;

    // 纯图片且为社交/图标类
    if (isPureImageLine(lt)) {
      const imgUrl = extractImageUrl(lt);
      if (isSocialIconUrl(imgUrl)) continue;
    }

    // 含"在看/点赞/点亮"等字样且包含微信动图（常见为 mmbiz.qpic.cn 或 weserv 代理到 gif）
    if (/(在看|点赞|点亮)/.test(lt) && /!\[[^\]]*\]\([^)]*(mmbiz\.qpic\.cn|images\.weserv\.nl)[^)]*(wx_fmt=gif|\.gif)/i.test(lt)) {
      continue;
    }

    // 装饰性分割线
    if (/^[-–—=\s_|·•]{4,}$/.test(lt)) continue;

    kept.push(l);
  }

  // 尾部窗口进一步精简（仅针对末段，降低误伤）
  const tailStart = Math.floor(kept.length * 0.7);
  if (tailStart > 0) {
    const refined: string[] = [];
    for (let i = 0; i < kept.length; i++) {
      const line = kept[i];
      if (i < tailStart) { refined.push(line); continue; }
      const lt = (line || '').trim();

      // 末段：社交/头像/二维码等图片丢弃
      if (/^!\[[^\]]*\]\(([^)]+)\)\s*$/.test(lt)) {
        const imgUrl = (lt.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1] || '';
        if (/(avatar|author|default|bottom|qrcode|qr|logo|icon|share|like|miniapp|wechat|weixin|qlogo|qpic)/i.test(imgUrl)) {
          continue;
        }
      }

      // 末段：联系方式/推广
      if ((PHONE_RE.test(lt) && CONTACT_RE.test(lt)) || PROMO_RE.test(lt)) continue;

      // 末段：仅符号或极短噪音
      if (/^[×\-–—=·•_|\s]{1,3}$/.test(lt)) continue;

      refined.push(line);
    }
    kept.length = 0; kept.push(...refined);
  }

  // 结尾"相关阅读/免责声明/— END —"等截断（触发点放在 60% 之后，避免误伤）
  const sectionBreak = /^(相关阅读|相关推荐|更多阅读|延伸阅读|相关链接|相关文章|参考资料|版权声明|免责声明|商务合作|联系我们|关于我们|隐私政策|用户协议|—+\s*END\s*—+|THE\s+END|END|推荐专栏|推荐阅读|热门文章|更多推荐|更多阅读|查看更多|专栏|评论|参与评论|我要评论|留言|阅读原文|继续滑动看下一个|轻触阅读原文|微信扫一扫|关注公众号|使用小程序|回顶部)\b/i;
  const minCut = Math.floor(kept.length * 0.6);
  let cut = -1;
  for (let i = minCut; i < kept.length; i++) {
    if (sectionBreak.test((kept[i] || '').trim())) { cut = i; break; }
  }
  const arr = cut >= 0 ? kept.slice(0, cut) : kept;

  // 多余空行规整
  s = arr.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return s;
}
