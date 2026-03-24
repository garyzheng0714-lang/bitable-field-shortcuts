# 【FBIF】OpenRouter Image Generation（Bitable 字段捷径）

基于 FaaS 的飞书多维表格字段捷径插件。  
用于在表格中调用 OpenRouter 的 `google/gemini-3-pro-image-preview`（Nano Banana Pro）生成图片，并写回附件字段。

## 功能概览

- 默认模型：`google/gemini-3-pro-image-preview`
- 结果类型：`Attachment`
- 支持参考图输入字段（单一入口）：
  - 附件字段（自动取 `tmp_url`）
  - 链接字段
  - 文本字段（自动提取 URL）
- 支持常用可选参数：
  - `image_config.aspect_ratio`
  - `image_config.image_size`
  - `temperature`
  - `top_p`
  - `seed`
  - `max_tokens`
  - `stop`
  - `include_reasoning`
  - `reasoning` / `response_format` / `structured_outputs`
  - `extra_body_json` 透传参数
- 自动处理 OpenRouter 图片返回：
  - `http(s)` 直链：直接写入附件 URL
  - `data:image/...;base64`：上传 OSS 后写入附件 URL

## 运行环境

- Node.js：建议 `14.21.0`（与线上 FaaS 环境对齐）
- 启动调试服务端口：`8080`

## 本地开发

```bash
npm install
npm run start
```

## 打包发布

```bash
npm run pack
```

打包产物输出在 `output/` 目录（zip 文件）。

## 关键配置

### 1) OpenRouter API Key

插件表单中填写 `OpenRouter API密钥`（`sk-or-v1-...`）。

### 2) OSS 配置（用于中转 base64 图片）

在 `/Users/simba/local_vibecoding/google:gemini-3-pro-image-preview/src/index.ts` 中配置：

- `OSS_ACCESS_KEY_ID`
- `OSS_ACCESS_KEY_SECRET`
- `OSS_BUCKET`
- `OSS_DOMAIN`

当前仓库已将 AK/SK 设为占位符，发布前请替换为你自己的有效配置。

## 字段与限制说明

- 参考图最多读取 `8` 张
- 输出附件最多写入 `5` 个（符合 Bitable 附件字段上限）
- 单个输出附件大小限制 `10MB`

## 域名白名单

- `openrouter.ai`
- `open.feishu.cn`
- `open.larksuite.com`
- `fbif-feishu-base.oss-cn-shanghai.aliyuncs.com`（如更换 OSS 域名请同步修改）

## 仓库结构

- `/Users/simba/local_vibecoding/google:gemini-3-pro-image-preview/src/index.ts`：核心字段捷径逻辑
- `/Users/simba/local_vibecoding/google:gemini-3-pro-image-preview/test/index.ts`：本地测试入口
- `/Users/simba/local_vibecoding/google:gemini-3-pro-image-preview/output/`：打包输出
