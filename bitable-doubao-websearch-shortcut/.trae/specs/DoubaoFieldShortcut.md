# 豆包大模型字段捷径设计文档

## 1. 概述
本插件旨在多维表格中集成豆包大模型（Doubao）的文本生成能力。支持用户输入提示词、上传图片（多模态），并可选择是否开启联网搜索工具以及深度思考模式。插件将返回模型的回答、思考过程、Token 消耗统计以及预估费用。

## 2. 表单配置 (Form Items)

插件配置页面将包含以下字段：

| 字段 Key | 组件类型 | 标签 (Label) | 必填 | 说明/默认值 |
| :--- | :--- | :--- | :--- | :--- |
| `modelType` | `SingleSelect` | 模型类型 | 是 | 选项：<br>1. `doubao-seed-1-8-251228`<br>2. `doubao-seed-1-6-251015`<br>3. `doubao-seed-1-6-flash-250828`<br>4. `doubao-seed-1-6-lite-251015`<br>5. `doubao-seed-1-6-thinking-250715`<br>6. `自定义模型` |
| `customModel` | `Input` | 自定义模型名称 | 否 | 仅当 `modelType` 选择 `自定义模型` 时生效。 |
| `prompt` | `Input` | 输入指令 | 是 | 用户的文本输入。 |
| `images` | `FieldSelect` | 图片内容 | 否 | 支持字段类型：`文本` (URL字符串)、`URL`。支持英文逗号分隔的多个链接。 |
| `thinkingMode` | `SingleSelect` | 深度思考 | 是 | 选项：<br>1. `AI 自动判断` (默认)<br>2. `进行深度思考`<br>3. `不进行深度思考` |
| `webSearch` | `Radio` | 联网搜索 | 是 | 选项：`开启`、`关闭`。默认：`关闭`。 |
| `apiKey` | `Input` | API Key | 是 | 火山引擎 API Key。<br>帮助说明链接：[获取 API Key](https://www.volcengine.com/docs/82379/1399008?lang=zh) |

## 3. 输出配置 (Result Type)

插件将返回一个对象 (Object)，包含以下属性：

| 属性 Key | 字段类型 | 标签 (Label) | 说明 |
| :--- | :--- | :--- | :--- |
| `result` | `Text` | 输出结果 | 模型生成的最终回答。 |
| `thinking` | `Text` | 思考过程 | 模型的思维链内容 (如涉及深度思考)。 |
| `usage` | `Text` | Tokens 数量 | 格式：`输入：xxx tokens，输出：xxx tokens` |
| `cost` | `Number` | 模型费用(¥) | 单位：人民币 (¥)。根据选择的“模型类型”和实际 Token 消耗计算。 |
| `groupKey` | `Text` | id | 内部分组键，构建时要求存在，默认隐藏。 |

## 4. 功能逻辑 (Execute)

1.  **输入处理**：
    *   获取 `apiKey`。
    *   获取 `prompt` 文本（输入指令）。
    *   获取 `modelType`，若为 `自定义模型` 则使用 `customModel` 作为最终模型名。
    *   处理 `images` 字段：读取字段值，若是字符串则按英文逗号 `,` 分割，清洗空白字符，提取有效的图片 URL。
    *   处理 `webSearch`：若为“开启”，则在 API 请求中构造相应的工具调用 (tools) 参数。
    *   处理 `thinkingMode`：
        *   `AI 自动判断`: 不传 `thinking` 参数。
        *   `进行深度思考`: 传 `thinking: { type: "enabled" }`。
        *   `不进行深度思考`: 传 `thinking: { type: "disabled" }`。

2.  **API 调用**：
    *   调用火山引擎 `Responses API` (`https://ark.cn-beijing.volces.com/api/v3/responses`)。
    *   **Auth**: Header `Authorization: Bearer {apiKey}`。
    *   **Body**:
        *   `model`: `{modelType}`（若为 `自定义模型` 则为 `{customModel}`）
        *   `input`: 
            *   若无图片：字符串 `{prompt}`（不开启联网搜索时）
            *   若无图片但开启联网搜索：数组 `[{role: "user", content: prompt}]`
            *   若有图片：数组 `[{type: "text", text: prompt}, {type: "image_url", image_url: {url: ...}}]`
        *   `tools` (若联网开启): `[{ type: "web_search", max_keyword: 2 }]`。
        *   `thinking` (根据 `thinkingMode` 传参)。

3.  **费用计算**：
    *   单价参考 (元/百万Token)：
        *   `doubao-seed-1.8`: 输入 0.80, 输出 2.00
        *   `doubao-seed-1.6`: 输入 0.80, 输出 2.00
    *   计算公式：`((输入Tokens * 0.8) + (输出Tokens * 2.0)) / 1,000,000`。
    *   保留 6 位小数或更多以确保精确，最后显示时可格式化。

4.  **结果返回**：
    *   解析 API 响应，提取 `output.text` (或 `message.content`) 作为 `result`。
    *   提取 `thinking` 内容（如果有）。
    *   提取 `usage`。
    *   返回 `cost`。

## 5. 异常处理
*   若 API 调用失败，返回错误信息到 `result` 字段，费用置为 0。
*   若图片 URL 无效，记录日志并仅发送文本提示词。

## 6. 技术细节
*   使用 `@lark-opdev/block-basekit-server-api`。
*   代码完全重写 `src/index.ts`。
*   本地开发时，`block-basekit-cli` 依赖的 `@bdeefe/feishu-devtools-core` 未公开发布，项目内通过 `vendor/feishu-devtools-core` 提供最小 shim 以便启动。
