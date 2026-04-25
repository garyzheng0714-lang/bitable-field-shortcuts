# bitable-field-shortcuts

![类型](https://img.shields.io/badge/%E7%B1%BB%E5%9E%8B-%E9%A3%9E%E4%B9%A6%E5%AD%97%E6%AE%B5%E6%8D%B7%E5%BE%84-2563eb?style=flat-square)
![技术栈](https://img.shields.io/badge/%E6%8A%80%E6%9C%AF%E6%A0%88-TypeScript%20Node.js-0f766e?style=flat-square)
![状态](https://img.shields.io/badge/%E7%8A%B6%E6%80%81-%E6%8F%92%E4%BB%B6%E5%90%88%E9%9B%86-16a34a?style=flat-square)
![README](https://img.shields.io/badge/README-%E4%B8%AD%E6%96%87-brightgreen?style=flat-square)

飞书插件：集中维护飞书多维表格字段捷径，用于字段值处理、AI 生成、附件转换、网页提取与 FBIF 业务数据同步。

## 仓库定位

- 分类：飞书多维表格字段捷径 / 插件合集。
- 面向对象：需要在多维表格字段层面处理内容、调用模型、转换附件或对接业务系统的内部工具开发者。
- 运行宿主：飞书多维表格字段捷径 FaaS 沙箱。
- 与其他表格仓库的区别：本仓库维护“字段捷径”，通常没有完整前端 UI；边栏插件合集请见 [bitable-sidebar-plugins](https://github.com/garyzheng0714-lang/bitable-sidebar-plugins)，通用表格转换工具不在本仓库。

## 功能分类

### AI / 大模型调用

| 项目 | 说明 |
| --- | --- |
| [bitable-ai-hub](./bitable-ai-hub/) | 通过 OpenRouter 调用多模型，支持文本生成、联网搜索等字段捷径能力 |
| [bitable-doubao-websearch-shortcut](./bitable-doubao-websearch-shortcut/) | 调用豆包 / 火山方舟相关模型，支持文本、图片输入和联网搜索场景 |
| [bitable-Gemini-API](./bitable-Gemini-API/) | Google Gemini API 字段捷径，包含文本生成、图片理解和结构化输出相关文档 |
| [bitable-field-aliyun-bailian](./bitable-field-aliyun-bailian/) | 阿里云百炼 / 通义千问字段捷径，包含模型列表和联网搜索资料 |
| [bitable-fbif-aliyun-qwen-text-generation](./bitable-fbif-aliyun-qwen-text-generation/) | 基于阿里云百炼 OpenAI 兼容接口的文本生成字段捷径 |
| [bitable-fbif-OpenRouter-Image-Generation](./bitable-fbif-OpenRouter-Image-Generation/) | OpenRouter 图片生成字段捷径，支持参考图和对象存储上传配置 |
| [bitable-Proofreading-Assistant](./bitable-Proofreading-Assistant/) | AI 文本纠错助手，输出修改后内容和修改说明 |

### 网页提取 / 内容转换

| 项目 | 说明 |
| --- | --- |
| [bitable-fbif-url-to-markdown](./bitable-fbif-url-to-markdown/) | 网页 URL 转 Markdown，包含微信公众号内容解析和正文转换能力 |
| [bitable-article-markdown-converter](./bitable-article-markdown-converter/) | 网页正文提取与 Markdown 转换，优先调用 Jina Reader 并包含本地回退逻辑 |

### 文件 / 附件处理

| 项目 | 说明 |
| --- | --- |
| [bitable-fbif-attachment-to-url](./bitable-fbif-attachment-to-url/) | 将多维表格附件上传到对象存储并写回可访问链接 |
| [bitable-link-to-attachment-field](./bitable-link-to-attachment-field/) | 将下载链接批量转换为多维表格附件字段 |
| [bitable-link-to-QR-Code](./bitable-link-to-QR-Code/) | 将链接生成二维码，支持多种样式配置 |
| [bitable-text-to-table-image](./bitable-text-to-table-image/) | 将结构化文本渲染为表格图片，也包含附件转链接相关模式 |

### 数据查询

| 项目 | 说明 |
| --- | --- |
| [bitable-food-license-lookup-field](./bitable-food-license-lookup-field/) | 通过食品生产许可证编号查询生产者、有效期等信息 |
| [bitable-company_query](./bitable-company_query/) | 通过企业名称查询工商注册信息 |

### 集成 / 数据传输

| 项目 | 说明 |
| --- | --- |
| [bitable-anycross-transport](./bitable-anycross-transport/) | 飞书集成平台 AnyCross 传输工具，支持 JSON / KV HTTP POST 模式 |

### FBIF 业务工具

| 项目 | 说明 |
| --- | --- |
| [bitable-fbif-exhibitor-upload-tool](./bitable-fbif-exhibitor-upload-tool/) | 将展商数据推送到 FBIF 报馆系统 |
| [bitable-fbif-exhibitor-design-info-query](./bitable-fbif-exhibitor-design-info-query/) | 查询展商报图 / 设计信息提交状态和审核统计 |

## 技术栈

- TypeScript
- Node.js
- `@lark-opdev/block-basekit-server-api`
- `@lark-opdev/block-basekit-cli` / `@lark-opdev/cli`
- 飞书多维表格字段捷径 FaaS 运行环境

个别项目会根据业务需要引入对象存储 SDK、加密库、HTML 解析库或 API 客户端。请以对应子目录的 `package.json` 和 `README.md` 为准。

## 项目结构

```text
.
├── README.md
├── bitable-ai-hub/
├── bitable-doubao-websearch-shortcut/
├── bitable-Gemini-API/
├── bitable-link-to-QR-Code/
├── bitable-text-to-table-image/
└── ...
```

常见子项目结构：

```text
<shortcut>/
├── src/index.ts        # 字段捷径入口
├── config.json         # 字段捷径配置
├── package.json        # 项目依赖和脚本
├── tsconfig.json
├── README.md           # 子项目说明
└── test/               # 可选的本地测试脚本
```

## 开始开发

每个字段捷径需要在自己的子目录内独立安装依赖和运行命令：

```bash
cd bitable-link-to-QR-Code
npm install
```

常见脚本：

```bash
npm start      # 启动字段捷径本地调试服务
npm run dev    # 执行一次字段捷径函数，便于查看日志
npm run build  # 构建项目
npm run pack   # 打包为 output/output.zip，用于上传到飞书开发者后台
```

部分项目使用 `block-basekit-cli-wrapper.js` 调用 CLI，脚本名称保持一致。

## 配置

- 字段输入、输出和运行参数通常在子项目的 `config.json` 中维护。
- API Key、对象存储凭证、模型配置、外部系统地址等敏感配置不要提交到仓库。
- 部分项目提供 `config_template.json`、`docx/` 或 `docs/` 目录，请优先阅读子项目 README 和随附文档。

## 运行环境说明

- 推荐 Node.js 版本：以子项目 `package.json` / CLI 要求为准，字段捷径常见最低版本为 Node.js 14.21+。
- 目标环境：飞书多维表格字段捷径 FaaS 沙箱。
- 沙箱存在内存、超时、网络和依赖限制；避免引入在飞书沙箱中不可用的重型依赖。
- `output/` 目录中的打包产物用于发布流程，不是日常开发入口。

## 维护说明

本仓库是字段捷径集合仓库。新增或调整插件时，请同步更新：

1. 子项目 `README.md`
2. 子项目 `config.json` 或配置模板
3. 本仓库根目录的项目目录表
