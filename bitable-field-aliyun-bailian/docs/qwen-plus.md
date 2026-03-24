
# 通义千问-Plus（Qwen-Plus）模型说明

## 模型简介
**通义千问-Plus（Qwen-Plus）** 属于 Qwen3 系列模型，融合 **思考模式 / 非思考模式**，可在对话中灵活切换。  
在推理能力上显著超过 QwQ，在通用能力上超过 Qwen2.5-Plus，达到同规模模型的业界领先水平（SOTA）。

---

## 模型能力
- 深度思考（Thinking Mode）
- 文本生成
- Function Calling
- 结构化输出
- 联网搜索
- 前缀续写
- Cache 缓存
- 批量推理
- 模型调优

---

## 输入 / 输出模态
**输入模态**
- 文本

**输出模态**
- 文本

---

## 模型限流与上下文
- 最大输入长度：997K tokens
- 最大上下文长度：1M tokens
- 最大输出长度：32K tokens
- RPM：15,000
- TPM：5,000,000

---

## 模型价格（阶梯计费）

### 输入（≤128K）
- 输入：0.0008 元 / 千 Token
- 输入（思考）：0.0008 元 / 千 Token
- 输入（缓存命中）：0.00016 元 / 千 Token
- 输入（思考模式缓存命中）：0.00016 元 / 千 Token
- 输入（批量推理）：0.0004 元 / 千 Token
- 输入（思考模式批量推理）：0.0004 元 / 千 Token

### 显式缓存
- 显式缓存创建：0.001 元 / 千 Token
- 显式缓存命中：0.00008 元 / 千 Token
- 显式缓存创建（思考）：0.001 元 / 千 Token
- 显式缓存命中（思考）：0.00008 元 / 千 Token

### 输出
- 输出：0.002 元 / 千 Token
- 输出（思考）：0.008 元 / 千 Token
- 输出（批量推理）：0.001 元 / 千 Token
- 思考模式输出（批量推理）：0.004 元 / 千 Token

---

## 免费额度
- 免费额度：1,000,000 Tokens
- 到期时间：2026-02-04
- 免费额度用完即停

---

## API 调用示例（OpenAI 兼容）

```js
import OpenAI from "openai";
import process from 'process';

// 初始化 openai 客户端
const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY, // 从环境变量读取
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
});
let isAnswering = false;
async function main() {
    try {
        const messages = [{ role: 'user', content: '你是谁' }];
        const stream = await openai.chat.completions.create({
            model: 'qwen-plus',
            messages,
            stream: true,
            enable_thinking: true
        });
        console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20));
        for await (const chunk of stream) {
            const delta = chunk.choices[0].delta;
            if (delta.reasoning_content !== undefined && delta.reasoning_content !== null) {
                if (!isAnswering) {
                    process.stdout.write(delta.reasoning_content);
                }
            }
            if (delta.content !== undefined && delta.content) {
                if (!isAnswering) {
                    console.log('\n' + '='.repeat(20) + '完整回复' + '='.repeat(20));
                    isAnswering = true;
                }
                process.stdout.write(delta.content);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
main();
```

---

## 备注
- 免费额度耗尽后将自动转为按量付费
- 建议通过环境变量配置 API Key，避免硬编码
- 兼容 OpenAI Chat Completions 接口，便于现有项目迁移
