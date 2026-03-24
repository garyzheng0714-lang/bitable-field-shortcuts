## 项目简介

这是一个基于「多维表格 字段捷径插件（FaaS 版）」的字段捷径项目，用于在多维表格中一键调用豆包·方舟（Ark）多模态模型，实现：
- 文本 + 图片（支持多张）输入
- 可选联网搜索
- 深度思考/自动/关闭三种思考模式
- 自动计算 token 用量与预估费用

## 运行环境要求

- Node.js：推荐与线上一致，≥ 14.21.0
- 运行环境：飞书多维表格 FaaS 沙箱（1C/1G，超时 15 分钟）
- 网络限制：无法访问公司内网
- 依赖限制：避免使用 axios / got / moment / sharp / jsdom 等沙箱禁用库

## 快速开始（本地调试）

1. 安装依赖
   - `npm install`
2. 启动本地服务
   - `npm start`
3. 本地执行一次 execute（便于看日志）
   - `npm run dev`

调试表单 UI 与 execute 推荐配合「字段捷径开发助手」使用（按官方《FaaS 字段捷径开发指南》创建调试字段并触发运行）。

## 字段配置说明（formItems）

字段配置与执行逻辑代码见 [index.ts](file:///Users/simba/Library/Mobile%20Documents/com~apple%20CloudDocs/Trae/%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E5%AD%97%E6%AE%B5%E6%8D%B7%E5%BE%84/%E8%B1%86%E5%8C%85%E5%A4%A7%E6%A8%A1%E5%9E%8B%EF%BC%88%E8%81%94%E7%BD%91&%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8%EF%BC%89/doubao-websearch/src/index.ts)。

- 模型选择：预置模型 / 自定义模型
- 自定义模型名称：仅当选择「自定义模型」时生效
- 自定义 Key：可选；未填写时使用内置 Key（建议生产环境填写自己的 Key）
- 输入指令：必填
- 图片内容：支持 URL 或附件字段（单次最多 10 张）
  - URL：支持逗号、中文逗号、换行分隔多张
  - 附件：自动下载并上传到 Ark Files，再以 file_id 形式喂给模型
- 联网搜索：关闭/开启（开启会注入 `web_search` 工具；并提供计费文档链接）
- 深度思考：自动/开启/关闭（对应 Ark Responses 的 thinking 参数）

## 图片输入支持

- 多图 URL：
  - 示例：`https://a.jpg,https://b.jpg,https://c.jpg`
- 附件字段：
  - 支持 `attachmentToken` 与常见临时下载地址字段（如 `tmp_url` / `download_url` / `preview_url`）
  - 若附件无法下载，会返回明确错误提示（通常是权限或附件类型问题）

## 错误提示（鉴权 vs 上传失败）

当 API Key 被禁用/删除/无效时，Ark Files 或 Ark Responses 都可能返回 401/403 或 `AuthenticationError`。本项目会将其映射为更准确的提示，而不是笼统显示“上传图片失败”：
- 相关逻辑在 [index.ts](file:///Users/simba/Library/Mobile%20Documents/com~apple%20CloudDocs/Trae/%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E5%AD%97%E6%AE%B5%E6%8D%B7%E5%BE%84/%E8%B1%86%E5%8C%85%E5%A4%A7%E6%A8%A1%E5%9E%8B%EF%BC%88%E8%81%94%E7%BD%91&%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8%EF%BC%89/doubao-websearch/src/index.ts#L455-L505)

## 域名白名单

项目通过 `basekit.addDomainList` 维护可访问域名白名单，包含 Ark/飞书域名与常见电商图片域名。

## 构建与打包

- 构建：`npm run build`
- 打包：`npm run pack`
  - 生成 `output/output.zip`，用于提审/发布
