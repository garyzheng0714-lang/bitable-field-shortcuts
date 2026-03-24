# 飞书多维表格插件合集

> Feishu Bitable Plugins Collection

本仓库收录了所有飞书多维表格（Lark Bitable）插件，包含 **字段捷径**（FaaS）和 **边栏插件**（Sidebar）两大类，按功能分类整理。

## 字段捷径（Field Shortcuts）

### AI / 大模型调用

| 项目 | 说明 |
|------|------|
| [bitable-ai-hub](./bitable-ai-hub/) | OpenRouter 多模型调用工具，支持 GPT-5.2、Gemini 3、Kimi、通义千问等 400+ 模型，支持深度思考和联网搜索 |
| [bitable-doubao-websearch-shortcut](./bitable-doubao-websearch-shortcut/) | 豆包·方舟多模态模型调用，支持联网搜索、深度思考，自动计算 Token 用量与费用 |
| [bitable-Gemini-API](./bitable-Gemini-API/) | Google Gemini API 调用字段捷径 |
| [bitable-field-aliyun-bailian](./bitable-field-aliyun-bailian/) | 阿里云百炼（通义千问）字段捷径，支持 Qwen 系列模型及三级联网搜索 |
| [bitable-fbif-aliyun-qwen-text-generation](./bitable-fbif-aliyun-qwen-text-generation/) | 阿里云百炼 OpenAI 兼容接口文本生成，返回思考内容、Token 用量及费用预估 |
| [bitable-fbif-OpenRouter-Image-Generation](./bitable-fbif-OpenRouter-Image-Generation/) | OpenRouter AI 图片生成器，支持参考图输入，自动上传 OSS |
| [bitable-Proofreading-Assistant](./bitable-Proofreading-Assistant/) | AI 纠错助手，返回修改后内容和修改说明（对象类型双列输出） |

### 网页提取 / 内容转换

| 项目 | 说明 |
|------|------|
| [bitable-fbif-url-to-markdown](./bitable-fbif-url-to-markdown/) | 网页转 Markdown，专用微信公众号解析器 + Jina Reader API |
| [bitable-article-markdown-converter](./bitable-article-markdown-converter/) | 网页正文提取转 Markdown，自研正文抽取算法，不依赖第三方库 |

### 文件 / 附件处理

| 项目 | 说明 |
|------|------|
| [bitable-fbif-attachment-to-url](./bitable-fbif-attachment-to-url/) | 附件转链接，上传至阿里云 OSS 或火山引擎 TOS 生成永久 URL |
| [bitable-link-to-attachment-field](./bitable-link-to-attachment-field/) | 链接转附件，将下载 URL 批量转换为多维表格附件字段 |
| [bitable-link-to-QR-Code](./bitable-link-to-QR-Code/) | 链接转二维码，支持多种预设样式（含 FBIF/Simba 品牌样式） |
| [bitable-text-to-table-image](./bitable-text-to-table-image/) | 文本转表格图片，将结构化文本渲染为 PNG 表格图上传至对象存储 |

### 数据查询

| 项目 | 说明 |
|------|------|
| [bitable-food-license-lookup-field](./bitable-food-license-lookup-field/) | 食品生产许可证查询，通过许可证编号查询生产者信息、有效期等 |
| [bitable-company_query](./bitable-company_query/) | 企业工商信息查询，通过企业名称查询 25+ 项工商注册信息 |

### 集成 / 数据传输

| 项目 | 说明 |
|------|------|
| [bitable-anycross-transport](./bitable-anycross-transport/) | 飞书集成平台 (AnyCross) 传输工具，支持 JSON/KV 双模式 HTTP POST |

### FBIF 业务工具

| 项目 | 说明 |
|------|------|
| [bitable-fbif-exhibitor-upload-tool](./bitable-fbif-exhibitor-upload-tool/) | 展商报馆信息上传，将展商数据推送至 FBIF 报馆系统 |
| [bitable-fbif-exhibitor-design-info-query](./bitable-fbif-exhibitor-design-info-query/) | 展商报馆信息查询，查询展位图纸提交状态和审核统计 |

## 边栏插件（Sidebar Plugins）

> 详见 [sidebar-plugins/README.md](./sidebar-plugins/README.md)

边栏插件以 iframe 形式运行在多维表格侧边栏中，拥有完整的前端 UI，支持批量操作。

| 项目 | 说明 | 技术栈 |
|------|------|--------|
| [文字转表格图片](./sidebar-plugins/lark-base-plugin-sidebar-text-to-table-image/) | 将文本字段渲染为表格图片并上传至云存储 | React + TS |
| [网页正文提取器](./sidebar-plugins/lark-base-plugin-sidebar-Web-Extractor/) | 网页内容提取，Amazon 畅销榜结构化解析 | Vue 3 + Element Plus |
| [链接批量转附件](./sidebar-plugins/lark-base-plugin-sidebar-multi-link-to-attachment/) | 多组字段映射的 URL 批量下载转附件 | React 18 + Ant Design 5 |
| [行记录生成文档](./sidebar-plugins/lark-base-plugin-sidebar-row-to-document/) | 根据行记录生成文档 | - |
| [MD5 加密插件](./sidebar-plugins/feishu-md5-encrypt-plugin/) | 对表格数据进行 MD5 哈希 | - |
| [海报批量生成器](./sidebar-plugins/bitable-poster-generator/) | 从表格数据批量生成海报 | React + TS + Vite |

---

## 通用开发指南

所有字段捷径项目共享相同的开发流程：

```bash
# 安装依赖
npm install

# 本地开发调试
npm start      # 启动本地服务
npm run dev    # 执行一次 execute 函数（查看日志）

# 构建与发布
npm run build  # 构建产物
npm run pack   # 打包为 output/output.zip，上传至飞书开发者后台
```

### 运行环境

- Node.js >= 14.21.0
- 运行环境：飞书多维表格 FaaS 沙箱（1C/1G，超时 15 分钟）
- 网络限制：无法访问公司内网
- 依赖限制：避免使用 axios / got / moment / sharp / jsdom 等沙箱禁用库

## 原始仓库

各项目原始独立仓库均位于 [garyzheng0714-lang](https://github.com/garyzheng0714-lang) GitHub 账号下。
