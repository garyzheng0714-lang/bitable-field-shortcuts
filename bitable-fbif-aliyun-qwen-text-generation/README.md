# 飞书多维表格字段捷径 - 阿里云百炼文本模型

这是一个用于飞书多维表格字段捷径（FaaS）的项目，支持直接调用阿里云百炼 OpenAI 兼容接口进行文本生成，并在单元格返回：

- 模型输出文本
- 思考内容（若模型返回）
- Token 用量
- 按官方参考单价估算的费用（人民币）

## 支持模型（文本）

内置模型（可直接选）：

- `qwen-max`
- `qwen-plus`
- `qwen-flash`
- `qwen-turbo`

也支持自定义模型 ID（`custom`），用于阿里云模型列表中的其他文本模型。

## 费用标注口径

- 单价来源：阿里云百炼模型列表（中国内地公有云）
- 统计日期：2026-02-17
- 计费单位：人民币 / 百万 Token
- 本插件返回值为**预估费用**，不包含缓存命中、活动折扣、Batch 等差异项

### 预估公式

普通模式：

`estimated_cost = prompt_tokens * input_price / 1,000,000 + completion_tokens * output_price / 1,000,000`

思考模式（且接口返回 `reasoning_tokens`）：

`estimated_cost = prompt_tokens * input_price / 1,000,000 + (completion_tokens - reasoning_tokens) * output_price / 1,000,000 + reasoning_tokens * thinking_output_price / 1,000,000`

如果模型不支持思考模式，则会忽略思考开关，并按普通模式估算。

## 字段配置项

- 模型：选择内置模型或自定义模型
- 提示词：必填
- 思考模式：开启/关闭（仅部分模型支持）
- 百炼 API Key：必填
- 请求地址：默认 `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- 最大输出 Token：固定 4096（不支持配置）

## 输出字段

- 输出结果
- 思考内容
- Token用量（输入/输出/思考/总计）
- 预估费用(¥)

## 本地开发

```bash
npm install
npm run build
npm run pack
```

## 文档链接

- 使用教程（飞书云文档）：https://www.feishu.cn/docx/I23AdxZPeovazUxCSCAces3Jn3c
- 模型列表与价格：[阿里云百炼模型文档](https://help.aliyun.com/zh/model-studio/getting-started/models)
- 首次调用（OpenAI 兼容接口）：[首次调用通义千问 API](https://help.aliyun.com/zh/model-studio/first-api-call-to-qwen)

## 运行限制（平台）

- Node.js 14.21.0
- 单实例 1C1G
- 单次超时上限约 15 分钟
