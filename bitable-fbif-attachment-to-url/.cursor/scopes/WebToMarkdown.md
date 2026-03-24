# Feature Spec: 网页转 Markdown 字段捷径

## 1. 背景与目标 (Context & Goals)
用户需要一个多维表格字段捷径（FaaS 插件），用于将输入的网页链接（URL）转换为 Markdown 格式的文本内容。
核心需求是针对 **微信公众号文章** 和 **普通网页** 采用不同的处理策略，以确保最佳的抓取效果。

## 2. 核心功能 (Core Features)

### 2.1 输入输出
- **输入**:
  - `url`: 目标网页链接 (必填)
  - `save_images`: 是否转存图片 (可选，暂定后续迭代，本期先只处理文本/链接)
- **输出**:
  - `markdown`: 转换后的 Markdown 文本内容

### 2.2 逻辑分支
系统根据输入 URL 自动判断处理方式：

#### A. 微信公众号文章 (`mp.weixin.qq.com`)
由于 Jina 等通用工具对微信公众号支持不佳（反爬、懒加载），采用 **定制化抓取方案**：
1. **获取 HTML**: 使用 `context.fetch` 获取页面源码。
2. **解析 DOM**: 使用 `cheerio` 加载 HTML。
3. **内容清洗**:
   - 提取 `#js_content` 核心内容区域。
   - **图片处理**: 将微信的 `data-src` 属性转换为标准 `src` 属性，解决懒加载导致图片丢失问题。
   - 移除无关元素 (脚本、样式、广告位等)。
4. **转换 Markdown**: 使用 `turndown` 库将清洗后的 HTML 转换为 Markdown。

#### B. 普通网页 (其他域名)
利用 **Jina Reader API** 的强大通用能力：
1. **调用 API**: 请求 `https://r.jina.ai/<URL>`。
2. **获取结果**: 直接获取返回的 Markdown 内容。
3. **兜底**: 如果 Jina 调用失败，返回错误提示或尝试基础抓取（视复杂度而定，本期优先报错）。

## 3. 技术方案 (Technical Implementation)

### 3.1 依赖库
- `cheerio`: 用于服务端 DOM 操作 (需新增依赖)。
- `turndown`: 用于 HTML 转 Markdown (需新增依赖)。
- `@lark-opdev/block-basekit-server-api`: 飞书基础 SDK。

### 3.2 关键限制与应对
- **网络请求**: 必须使用 `context.fetch`，不能使用 `axios`/`got`。
- **域名白名单**: 需在代码中配置允许访问的域名（包括 `mp.weixin.qq.com`, `r.jina.ai` 以及常见的图片 CDN 域名以便后续扩展）。

## 4. 交互设计 (UI/UX)
- **表单配置**:
  1. **文章链接**: `Input` 组件 (必填)。
  2. **转换模式**: `SingleSelect` 组件 (可选，默认"自动识别"，也可强制指定"微信模式"或"通用模式")。

## 5. 待确认事项 (Open Questions)
- 是否需要支持批量 URL 输入？(本期假设为单链接)
- 对于过长的文章，是否需要截断或分段？(飞书字段可能有长度限制，建议不做处理，由用户自行裁切)
