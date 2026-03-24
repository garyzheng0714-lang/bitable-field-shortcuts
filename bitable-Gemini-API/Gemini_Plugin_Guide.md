# Gemini 多维表格字段捷径插件开发指南

本插件集成了 Google Gemini 的核心能力，允许用户在多维表格中直接利用 AI 进行文本生成、图片理解、结构化数据提取以及深度研究。

## 1. 插件功能概览

插件支持以下四种核心任务模式：

1.  **文本生成 (Text Generation)**: 支持通用问答、文本创作，可配合 Google 搜索 (Grounding) 提供实时信息。
2.  **图片理解 (Image Understanding)**: 读取多维表格附件中的图片，进行内容描述、OCR 或视觉问答。
3.  **结构化输出 (Structured Output)**: 强制模型按照指定的 JSON Schema 返回数据，便于后续自动化处理。
4.  **深度研究 (Deep Research)**: 利用 Gemini Deep Research Agent 进行长时运行的深度调研任务，生成详细报告。

## 2. 配置参数说明

在添加字段捷径时，需要配置以下参数：

| 参数名 | 说明 | 必填 | 备注 |
| :--- | :--- | :--- | :--- |
| **Gemini API Key** | Google AI Studio 提供的 API 密钥 | 是 | 需妥善保管，建议使用 Masked 输入 |
| **任务类型 (Task Type)** | 选择要执行的任务模式 | 是 | 文本/图片/结构化/深度研究 |
| **模型选择 (Model)** | 选择 Gemini 模型版本 | 是 | 推荐 Gemini 2.5 Flash (快速) 或 Gemini 3 Pro (高级) |
| **输入字段 (Input Field)** | 引用表格中的现有字段 | 否 | 支持文本字段和附件字段 (图片) |
| **提示词 (Prompt)** | 给模型的指令 | 否 | 可与输入字段内容组合使用 |
| **启用 Google 搜索** | 是否使用搜索增强 | 否 | 仅适用于文本生成和结构化输出 |
| **JSON Schema** | 定义输出的 JSON 结构 | 否 | 仅在“结构化输出”模式下生效 |

## 3. 使用示例

### 3.1 文本生成 + 搜索增强
*   **场景**: 询问最新的体育赛事结果。
*   **配置**:
    *   Task Type: `Text Generation`
    *   Model: `gemini-2.5-flash`
    *   Prompt: "2024年欧洲杯冠军是谁？"
    *   Enable Search: `True`
*   **输出**:
    *   Content: "西班牙赢得了2024年欧洲杯..."
    *   Citations: "[1] UEFA.com (https://...)"

### 3.2 图片理解
*   **场景**: 从发票图片中提取金额。
*   **配置**:
    *   Task Type: `Image Understanding`
    *   Input Field: [选择附件字段]
    *   Prompt: "这张发票的总金额是多少？"
*   **输出**:
    *   Content: "总金额为 123.45 元"

### 3.3 结构化输出
*   **场景**: 从客户反馈中提取情感和关键词。
*   **配置**:
    *   Task Type: `Structured Output`
    *   JSON Schema:
        ```json
        {
          "type": "object",
          "properties": {
            "sentiment": {"type": "string", "enum": ["positive", "negative"]},
            "keywords": {"type": "array", "items": {"type": "string"}}
          }
        }
        ```
*   **输出**:
    *   Data: `{"sentiment": "positive", "keywords": ["UI", "fast"]}`

### 3.4 深度研究 (Deep Research)
*   **场景**: 调研行业竞品分析。
*   **配置**:
    *   Task Type: `Deep Research Agent`
    *   Model: `deep-research-pro-preview-12-2025`
    *   Prompt: "调研目前市场上主流的电动汽车电池供应商及其技术特点"
*   **输出**:
    *   Content: [长篇详细报告]
    *   Status: "Completed"

## 4. 最佳实践与注意事项

1.  **API Key 安全**: 本插件要求用户输入 API Key。在企业环境中使用时，建议通过后端代理或环境变量方式注入，避免前端明文输入（当前版本为演示方便直接输入）。
2.  **超时限制**: 多维表格字段捷径通常有 15 分钟的执行超时限制。Deep Research 任务可能耗时较长，如果超过限制可能会被中断。建议对于超长任务使用更简单的 Prompt 或拆分任务。
3.  **图片处理**: 插件会自动处理附件字段中的图片 URL。确保图片大小不超过 Gemini API 的限制 (20MB)。
4.  **调试**: 使用右侧边栏的「字段捷径调试助手」进行测试。修改代码后，需重新运行插件才能生效。

## 5. API 参考
*   [Gemini API 文档](https://ai.google.dev/gemini-api/docs)
*   [Deep Research 指南](https://ai.google.dev/gemini-api/docs/deep-research)
