# FBIF展商报馆信息查询工具

> 推荐 GitHub 仓库名称: `fbif-exhibitor-design-info-query`

这是一个飞书/Lark 多维表格（Base）的字段捷径插件。它允许用户在多维表格中通过输入“展位号”或“展商名称”，自动查询并回填该展商的报馆图纸提交状态、审核统计及详细展位信息。

本项目对接了“飞书报图信息对接接口” (`GetDesignList`)。

## 功能特性

*   **便捷查询**：引用表格中的文本字段（如展位号）作为关键词进行查询。
*   **自动处理**：自动去除输入关键词首尾的空格和换行符，提高查询准确率。
*   **信息丰富**：返回包括展位基本信息、设计图上传状态、图纸列表及统计详情在内的完整数据。
*   **多语言支持**：支持中文、英文、日文界面。

## 返回字段说明

捷径执行后将返回一个对象，包含以下信息：

*   **展商名称 (BoothExhibitor)**: 主要显示字段
*   **展位号 (BoothNO)**
*   **展馆 (Hall)**
*   **展会名称 (ShowNameCn)**
*   **上传状态 (DesignUpStatus)**: 原始状态码 (0/1)
*   **上传时间 (DesignUpTime)**
*   **图纸列表 (DesignList)**: JSON 格式文本
*   **图纸统计 (DesignStats)**: JSON 格式文本
*   **其他详情**: 展位ID、面积、类型ID等

## 开发指南 (Getting Started)

### 环境准备
确保本地已安装 Node.js (推荐 v14.21.0 或更高版本)。

### 安装依赖
```bash
npm install
```

### 启动本地调试服务
```bash
npm start
```
服务启动后（默认端口 8080），请在多维表格的“字段捷径开发助手”中开启本地调试模式进行测试。

### 测试执行函数
```bash
npm run dev
```

## 发布 (Publish)

1. 运行打包命令：
   ```bash
   npm run pack
   ```
2. 生成的文件位于 `output/output.zip`。
3. 将该 zip 包上传至飞书多维表格插件开发者后台进行发布。

## 接口说明

*   **API URL**: `http://service.best-expo.com.cn/GetUrl/lark/GetDesignList.ashx`
*   **Method**: GET
*   **Auth**: Fixed Code Verification

---
**Note**: 本项目代码仅供参考，实际部署时请确保网络环境能够访问上述 API 域名。
