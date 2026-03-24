# 链接转附件字段插件

一个用于飞书多维表格的 FaaS 字段捷径插件，可以将下载链接转换为附件字段。

## 功能特性

- 🔗 **智能链接提取**：自动从文本中提取 HTTP/HTTPS 链接
- 📎 **批量转换**：支持多个下载链接同时转换为附件
- 🔧 **灵活分隔符**：支持多种链接分隔符（换行符、逗号、分号等）
- 🌍 **多语言支持**：支持中文、英文、日文界面
- 📊 **安全限制**：单次最多生成 5 个附件，每个附件≤10MB
- 🎯 **智能命名**：根据 URL 自动生成合适的文件名

## 支持的域名

插件已预配置支持以下常用文件托管域名：

- **飞书相关**：feishu.cn, feishucdn.com, larksuitecdn.com, larksuite.com
- **代码托管**：github.com, githubusercontent.com, gitee.com
- **云存储**：aliyuncs.com, qcloud.com, amazonaws.com, alicdn.com
- **图片托管**：imgur.com, unsplash.com, pexels.com
- **网盘服务**：dropbox.com, onedrive.com, googledrive.com

## 安装

```bash
npm install
```

## 开发

```bash
# 启动本地开发服务器
npm run start

# 构建项目
npm run build

# 打包部署
npm run pack

# 开发模式
npm run dev
```

## 使用方法

### 基本用法

1. 在「附件下载链接」字段中输入包含下载链接的文本
2. 可选择指定链接分隔符（留空则自动识别）
3. 插件会自动提取 URL 并创建附件字段

### 输入示例

**多行链接**：
```
https://example.com/file1.pdf
https://example.com/file2.jpg
https://example.com/file3.zip
```

**逗号分隔**：
```
https://example.com/file1.pdf,https://example.com/file2.jpg,https://example.com/file3.zip
```

**混合文本**：
```
请下载以下文件：https://example.com/file1.pdf 和 https://example.com/file2.jpg
```

## 技术特性

### 智能链接解析

- 使用正则表达式自动提取 HTTP/HTTPS 链接
- 支持多种常见分隔符：逗号、分号、换行符、制表符等
- 自动清理链接末尾的标点符号

### 文件名生成

- 从 URL 路径自动提取文件名
- 支持 URL 解码处理中文文件名
- 无扩展名时自动添加 `.bin` 后缀

### 错误处理

- 输入类型验证
- 无效链接过滤
- 详细的调试日志输出

## 配置说明

### 限制

- 单次执行最多生成 5 个附件
- 每个附件大小限制 ≤10MB
- 超出限制的链接将被忽略

### 支持的输入格式

- 纯文本字符串
- 多行文本对象
- 数组格式（自动展开）

## 项目结构

```
link-to-attachment-field/
├── src/
│   └── index.ts          # 主要逻辑代码
├── test/
│   └── index.ts          # 测试文件
├── config.json           # 配置文件
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
└── README.md            # 项目说明
```

## 开发指南

### 本地测试

```bash
# 运行测试
cd test
ts-node index.ts
```

### 调试

插件内置详细的调试日志，包括：
- 输入参数解析
- 链接提取过程
- 有效性验证
- 附件构建结果

### 扩展域名支持

在 `src/index.ts` 中的 `basekit.addDomainList()` 添加新的域名：

```typescript
basekit.addDomainList([
  // 添加新域名
  'your-domain.com'
]);
```

## API 参考

### 输入参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `linksInput` | string | 是 | 包含下载链接的文本内容 |
| `separator` | string | 否 | 链接分隔符，留空则自动识别 |

### 返回结果

```typescript
{
  code: FieldCode.Success | FieldCode.Error,
  data?: Array<{
    name: string;           // 文件名
    content: string;        // 下载链接
    contentType: 'attachment/url';
  }>,
  message?: string;       // 错误信息
}
```

## 常见问题

### Q: 为什么某些链接无法识别？
A: 请确保链接以 `http://` 或 `https://` 开头，插件只处理这两种协议的链接。

### Q: 如何处理超过 5 个链接的情况？
A: 可以分批处理，或在工作流捷径中多次调用该插件。

### Q: 支持哪些文件格式？
A: 插件支持所有通过 HTTP/HTTPS 可下载的文件格式，文件类型由目标服务器决定。

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的链接转附件功能
- 多语言界面支持
- 智能链接提取和文件名生成