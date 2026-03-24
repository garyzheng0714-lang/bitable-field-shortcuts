
# 通义千问-Flash（Qwen-Flash）模型说明

## 模型简介
Qwen3 系列 Flash 模型，融合 **思考模式 / 非思考模式**，可在对话中切换。  
在复杂推理、指令遵循、文本理解等任务上表现优秀。  
支持 **最长 1M tokens 上下文**，并按上下文长度进行阶梯计费。

---

## 模型能力
- 深度思考（enable_thinking）
- 文本生成
- Function Calling
- 结构化输出
- 联网搜索
- 前缀续写
- Cache 缓存
- 批量推理
- 模型调优

---

## 输入 / 输出能力
**输入模态**
- 文本

**输出模态**
- 文本

---

## 上下文与限流
- 最大输入长度：997K
- 最大上下文长度：1M
- 最大输出长度：32K
- RPM：15000
- TPM：10,000,000

---

## 价格（阶梯计费）

### 输入（<=128K）
- 输入：0.00015 元 / 千 Token
- 输入（缓存命中）：0.00003 元 / 千 Token
- 输入（批量推理）：0.000075 元 / 千 Token

### 显式缓存
- 创建：0.0001875 元 / 千 Token
- 命中：0.000015 元 / 千 Token

### 输出
- 输出：0.0015 元 / 千 Token
- 输出（批量推理）：0.00075 元 / 千 Token

---

## 免费额度
- 免费额度：1,000,000 Tokens
- 到期时间：2026-02-04
- 免费额度用完即停

---

## API 调用示例（OpenAI 兼容）

```javascript
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
            model: 'qwen-flash',
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
- API Key 建议通过环境变量配置，避免硬编码
- 兼容 OpenAI Chat Completions 接口
- 适合高并发、长上下文、低延迟场景
