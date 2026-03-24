# 通义千问3-Max（qwen3-max）模型详情（百炼控制台）

> 来源：阿里云百炼控制台「模型广场 / qwen3-max」详情页  
> 页面提示：免费额度用完后将自动转为按量付费，请及时充值以保障服务持续。

## 基本信息
- 模型名称：通义千问3-Max
- 模型系列：qwen3
- 类型：文本生成
- 模型 Code：`qwen3-max`
- 更多信息（官方文档）：https://help.aliyun.com/document_detail/2766612.html

## 模型介绍
通义千问3系列 Max 模型，相较 preview 版本在**智能体编程**与**工具调用**方向进行了专项升级；正式版模型达到领域 SOTA 水平，可适配更复杂的智能体需求。

## 模型能力（页面列出）
- Function Calling
- 结构化输出
- 联网搜索
- 前缀续写
- Cache 缓存
- 批量推理
- 模型调优

> 注：页面在“模型能力”区域未显示“深度思考/Thinking”字样（以页面为准）。

## 输入 / 输出模态
- 输入模态：文本
- 输出模态：文本

## 模型价格（阶梯计费）
页面当前展示档位：**输入 <= 32K**（页面提供“切换百万 tokens”的入口）。

### 输入
- 输入：**0.0032 元 / 千 Token**
- 输入（缓存命中）：**0.00064 元 / 千 Token**
- 输入（批量推理）：**0.0016 元 / 千 Token**

### 显式缓存
- 显式缓存创建：**0.004 元 / 千 Token**
- 显式缓存命中：**0.00032 元 / 千 Token**

### 输出
- 输出：**0.0128 元 / 千 Token**
- 输出（批量推理）：**0.0064 元 / 千 Token**

## 免费额度
- 过期时间：**2026-02-04**
- 页面显示剩余：**999,982 / 1,000,000**

## 限流与上下文
- 最大输入长度：**252K**
- 上下文长度：**256K**
- 最大输出长度：**64K**
- RPM：**600**
- TPM：**1,000,000**

## API 代码示例（OpenAI 兼容 / Node.js）
页面默认展示：Node.js + OpenAI 兼容模式。

```js
import OpenAI from "openai";

const openai = new OpenAI(
  {
    // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  }
);

const completion = await openai.chat.completions.create({
  model: "qwen3-max",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "你是谁？" }
  ],
  stream: true
});

for await (const chunk of completion) {
  process.stdout.write(chunk.choices[0].delta.content);
}
```

---

## 备注（从页面可见信息整理）
- 页面提供「OpenAI 兼容 / DashScope」两种调用方式切换。
- 页面提供「获取 API Key」入口（建议把 `DASHSCOPE_API_KEY` 配到环境变量，避免硬编码）。
