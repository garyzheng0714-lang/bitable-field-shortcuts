# 【FBIF】OpenRouter - 多维表格 AI 大模型调用工具

一款基于 OpenRouter 的飞书多维表格字段捷径，让你在表格中一键调用 GPT-5.2、Gemini 3、Kimi、通义千问等主流 AI 模型，支持深度思考和联网搜索。

## ✨ 核心特性

- **多模型支持**：内置 GPT-5.2、Gemini 3、智谱 GLM、Kimi、通义千问等常用模型
- **自定义模型**：支持调用 OpenRouter 平台 400+ AI 模型
- **深度思考**：支持开启/关闭模型的深度推理模式
- **联网搜索**：支持模型实时联网获取最新信息
- **自动计费**：自动统计 Token 用量和费用

## 📖 使用教程

**新手必看**：[完整使用教程](https://foodtalks.feishu.cn/docx/AbzsdRhOooix0Sx6nbtcvlGDnHb?from=from_copylink)

## 🚀 快速开始

### 1. 获取 OpenRouter API Key

1. 访问 [OpenRouter](https://openrouter.ai/) 注册账号
2. 前往 [API Keys](https://openrouter.ai/settings/keys) 创建 Key
3. 复制 Key（格式：`sk-or-v1-...`）

### 2. 在多维表格中添加捷径

1. 打开多维表格，点击添加字段
2. 选择「字段捷径」→ 搜索「FBIF OpenRouter」
3. 配置 API Key 和选择模型
4. 保存后即可使用

## 📝 配置参数

| 参数 | 必填 | 说明 |
|------|------|------|
| 模型名称 | ✅ | 选择 AI 模型 |
| 自定义模型 | ❌ | 选择"其他自定义模型"时填写，格式：`provider/model-name` |
| 提示词 | ✅ | 发送给 AI 的指令 |
| 深度思考模式 | ❌ | 控制模型推理深度：默认/关闭/开启 |
| 联网搜索 | ❌ | 开启后模型可搜索最新信息（额外收费） |
| API Key | ✅ | OpenRouter API Key |
| 最大输出 Token | ❌ | 默认 4096 |
| 温度参数 | ❌ | 控制输出随机性，0-2，默认 1.0 |

## 📊 输出结果

| 字段 | 说明 |
|------|------|
| 输出结果 | AI 返回的文本内容 |
| 思考过程 | 深度推理的思维链（如有） |
| 费用($) | 本次调用费用（美元） |
| 输入/输出 Token | Token 消耗统计 |
| 推理 Token | 推理过程消耗的 Token |
| 实际调用模型 | 实际使用的模型 ID |

## 🤖 内置模型

| 模型 | ID |
|------|-----|
| OpenAI GPT-5.2 | `openai/gpt-5.2` |
| Google Gemini 3 Flash | `google/gemini-3-flash-preview` |
| Google Gemini 3 Pro | `google/gemini-3-pro-preview` |
| 智谱 GLM-4.7 | `z-ai/glm-4.7` |
| Kimi K2.5 | `moonshotai/kimi-k2.5` |
| Kimi K2 Thinking | `moonshotai/kimi-k2-thinking` |
| 通义千问 Qwen3 32B | `qwen/qwen3-32b` |
| 通义千问 Qwen3 235B | `qwen/qwen3-235b-a22b-2507` |

> 更多模型请选择「其他自定义模型」，查看 [OpenRouter 模型列表](https://openrouter.ai/models)

## 🔗 相关链接

- [使用教程](https://foodtalks.feishu.cn/docx/AbzsdRhOooix0Sx6nbtcvlGDnHb?from=from_copylink)
- [OpenRouter 官网](https://openrouter.ai/)
- [获取 API Key](https://openrouter.ai/settings/keys)
- [模型列表](https://openrouter.ai/models)

## 🛠️ 开发者

```bash
# 安装依赖
npm install

# 本地调试
npm run start

# 构建
npm run build

# 打包发布
npm run pack
```

> 运行环境：Node.js 14.21.0，超时限制 15 分钟

---

*基于 OpenRouter 构建，让 AI 触手可及。*
