# Gemini 多维表格字段捷径插件开发计划

## 1. 概览
本计划旨在开发一个集成 Google Gemini 强大能力的多维表格字段捷径插件。该插件将完全重写现有代码，支持文本生成、图片理解、结构化输出及 Deep Research Agent 功能。

## 2. 架构设计

### 2.1 用户配置 (`formItems`)
我们将设计一个灵活的配置界面，允许用户根据需求定制插件行为：
*   **API Key**: 用于鉴权 (密码输入框)。
*   **任务类型 (`taskType`)**: 下拉选择 (文本生成、图片理解、结构化输出、深度研究)。
*   **模型选择 (`model`)**: 下拉选择 (支持 Gemini 2.5 Flash/Pro, Gemini 3 Pro Preview, Deep Research 等)。
*   **输入字段 (`inputField`)**: 选择多维表格中的现有字段（文本或附件）作为输入。
*   **提示词 (`prompt`)**: 自定义提示词模板。
*   **JSON Schema**: 仅在“结构化输出”模式下显示，用于定义输出格式。
*   **启用搜索 (`enableSearch`)**: 开关，用于启用 Google Search Grounding。

### 2.2 执行逻辑 (`execute`)
核心执行函数将根据 `taskType` 分发处理逻辑：
1.  **文本生成**: 调用 `generateContent` 接口，支持 System Instructions 和 Search Tool。
2.  **图片理解**: 
    *   处理附件字段，获取图片 URL。
    *   下载图片并转换为 Base64 编码（解决内网/鉴权访问问题）。
    *   调用多模态 `generateContent` 接口。
3.  **结构化输出**: 
    *   构造带有 `response_mime_type: application/json` 和 `response_json_schema` 的请求。
    *   解析返回的 JSON 并格式化输出。
4.  **Deep Research Agent**:
    *   调用 Interactions API 创建任务 (`background=true`)。
    *   实现轮询机制 (Polling Loop) 等待任务完成。
    *   返回详细的研究报告。

### 2.3 输出定义 (`resultType`)
使用 `FieldType.Object` 以支持丰富的信息返回：
*   `content`: 主要文本结果 (Primary Field)。
*   `citations`: 引用来源 (针对搜索和研究任务)。
*   `data`: 结构化数据 (JSON)。
*   `status`: 执行状态。

## 3. 开发步骤

### 步骤 1: 重构 `src/index.ts`
*   清空原有代码。
*   引入必要的 `basekit` 和类型定义。
*   实现 `callGemini` 通用请求封装函数，处理错误和日志。
*   实现上述架构设计中的 `formItems`, `execute`, `resultType`。

### 步骤 2: 编写文档
*   创建 `Gemini_Plugin_Guide.md`。
*   包含：API 参考、功能模块说明 (文本/图片/结构化/搜索)、配置示例、最佳实践。

### 步骤 3: 测试支持
*   创建 `test/mock_test.ts`，模拟 `context` 和 `formItemParams`，用于本地验证逻辑（非真实 API 调用，而是逻辑验证）。
*   在文档中提供使用“字段捷径调试助手”的详细步骤。

## 4. 交付物清单
1.  `src/index.ts`: 完整的插件源代码。
2.  `Gemini_Plugin_Guide.md`: 完整的 API 文档和使用说明。
3.  `test/mock_test.ts`: 单元测试模拟脚本。
4.  `config_template.json`: 参数配置模板。

请确认此计划，确认后我将开始编码。