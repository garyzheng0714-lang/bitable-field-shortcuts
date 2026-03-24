# 纠错助手（字段捷径 · FaaS 版）

一个返回对象类型结果的字段捷径：一次调用同时产出两列数据。
- correctedContent：修改后的内容（纯文本）
- changeNotes：修改说明（纯文本）

## 快速开始
- 安装依赖：`npm install`
- 本地开发：`npm run dev`（需要 test/index.ts，仓库已内置）
- 构建产物：`npm run build`
- 打包发布：`npm run pack`（生成 `output/output_*.zip`）

## 字段配置说明
- 入参：
  - inputText（输入框，必填）— 待纠错文本。
- 出参（对象类型 FieldType.Object）：
  - correctedContent（多行文本）：主字段，携带 `primary: true` 和 `isGroupByKey: true`
  - changeNotes（多行文本）：修改说明

在多维表格中使用时，本字段捷径将返回一个对象，平台会为对象的每个属性生成对应的列。

## 实现特点
- 自适应出参解析：兼容 `modified`、`explain`、`AI`、`correctedText`、`choices[0].message.content` 等多种服务端字段。
- 纯文本清理：去除 Markdown/HTML/多余空白，保留有序列表编号。
- 说明兜底：若服务端无说明，自动生成简洁的“修改说明”。
- 稳健容错：接口异常/HTML错误页时返回原文与提示，避免单元格报错。

## 二次开发要点
- 代码入口：`src/index.ts`
- 白名单域名在 `basekit.addDomainList([...])` 中配置。
- 若服务端字段发生变化，可扩展 `extractCorrectedText / extractChangeNotes` 的路径别名或关键字。

## 接口联调（示例）
服务端返回：
```json
{"explain":"…修改原因…","modified":"这个文档需要添加一些内容"}
```
字段捷径出参将映射为：
- correctedContent = "这个文档需要添加一些内容"
- changeNotes = "…修改原因…"

## 注意
- 请勿在 execute 中返回 `FieldCode.Error`，以免在单元格中抛错；遇到异常按当前实现保持 `FieldCode.Success` 并给出友好提示。
- 如需变更主列显示，请调整 resultType.extra.properties 中的 `primary` 与 `isGroupByKey`。