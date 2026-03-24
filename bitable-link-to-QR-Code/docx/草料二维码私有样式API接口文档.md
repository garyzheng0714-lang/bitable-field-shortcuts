# 草料二维码私有样式 API 接口文档

## 一、功能说明

该接口文档适用于：调用账号下已保存的标签样式，在自有系统或网页中，批量生成不同内容的二维码标签。

对接后，可在自有系统里，批量生成二维码标签。无需导出数据在我们平台再导入数据生码。例如可对接产品、资产等管理系统。

**接口地址**：
`https://open-api.cli.im/cli-open-platform-service/v1/labelStyle/createWithKey`

## 二、接口调用说明

### HTTP请求方式

GET

### 请求参数

> **注意**：拼参数时需要进行 URL 编码

| 参数名称 | 是否必须 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| **cliT** | 是 | string | 标签样式编号,例如 D10 |
| **cliD** | 是 | string | 二维码动态内容。字节越多，二维码图案越复杂，建议在 1500 字节内 |
| **api_key** | 是 | string | 用户账号 api key |
| **sign** | 是 | string | 签名，生成方式见下方“加签方式” |
| return_file | 否 | string | 返回类型，不传时返回二进制图片流；传 `base64` 返回 base64 编码 |
| cliF | 否 | string | 根据我的样式需要传入的动态字段，cliF 表示普通文本字段，按照字段展示顺序排列 |
| cliP | 否 | string | 根据我的样式需要传入的动态字段，**cliP 表示图片字段**，图片需要公网可访问静态地址 |

**参数示例**：
例如我的样式有 3 个字段，全为文本字段，传入参数为：
`cliF1=xx&cliF2=xx&cliF3=xx`

例如我的样式有 4 个字段，第二个为图片字段，其余为文本字段，传入参数为：
`cliF1=xx&cliP2=xx&cliF3=xx&cliF4=xx`

### 加签方式

**加签目的**：使用 MD5 进行动态加签，通过在每次请求中生成新的签名，确保数据的安全性和完整性，防止数据被篡改或冒充，提高系统的安全性。

> 后台也可关闭动态加签，关闭后即可无需进行下方加签操作。

**生成步骤**：

1. 将请求参数按照 key 的字典序排列，然后用 `&` 拼接成字符串。

   **示例参数**：

   | key | value |
   | :--- | :--- |
   | cliT | D11 |
   | cliD | Test123 |
   | return_file | (空) |
   | cliP1 | `https://ncstatic.clewm.net/rsrc/2023/0331/11/823ace0e8a36e304ca8bfab683be6219.png` |
   | cliF2 | 京海市第一人民医院 |
   | cliF3 | Jinghai First People's Hospital |
   | cliF4 | 王菲菲 |
   | cliF5 | 职务：助理护士 |
   | cliF6 | 科室：住院部 |
   | cliF7 | 编号：NO-GT-043 |
   | api_key | CLb87ea759f877622c |

   **排序拼接后的字符串（未编码前）**：
   ```
   api_key=CLb87ea759f877622c&cliD=Test123&cliF2=京海市第一人民医院&cliF3=Jinghai First People's Hospital&cliF4=王菲菲&cliF5=职务：助理护士&cliF6=科室：住院部&cliF7=编号：NO-GT-043&cliP1=https://ncstatic.clewm.net/rsrc/2023/0331/11/823ace0e8a36e304ca8bfab683be6219.png&cliT=D11&return_file=
   ```

   *(注意：实际拼接时，部分语言库可能会自动进行 URL 编码，请确保签名前使用的是**原始字符串**还是**编码后的字符串**，文档示例中签名前使用的是**未编码的原始值**，但 Java 示例代码中使用了 URL 编码后的值，需根据实际测试结果为准。根据本捷径验证，应使用**key=value**直接拼接，value 不需要提前编码，但在拼接到最终 URL 时需要编码)*

   > **修正说明**：根据 Java 示例代码逻辑：
   > `data = params.entrySet().stream().sorted(...).map(...).collect(...)`
   > Java 的 map 里的 value 是原始值，所以签名时使用的是**原始值**。

2. 拼接系统提供的用户 `api secret` 到上述字符串最后。
   假设 secret 为 `ddb42b7299b90cb5e0fd6c41e154c15d`，得到如下字符串：

   ```
   api_key=CLb87ea759f877622c&...&return_file=ddb42b7299b90cb5e0fd6c41e154c15d
   ```

3. 将以上字符串进行 **MD5 加密**，全部取小写，得到签名 `sign`：
   `2f7ee4e4c678bde31a0345de23ea3d0e`

### 返回参数

- 当 `return_file` 未传时，返回二进制图片流。
- 当 `return_file=base64` 时，返回 base64 图片编码，可用于嵌入网页或传输到系统中。

### 请求示例

```
https://open-api.cli.im/cli-open-platform-service/v1/labelStyle/createWithKey?api_key=CLb87ea759f877622c&cliT=D11&cliD=Test123&cliP1=https%3A%2F%2Fncstatic.clewm.net%2Frsrc%2F2023%2F0331%2F11%2F823ace0e8a36e304ca8bfab683be6219.png&cliF2=%E4%BA%AC%E6%B5%B7%E5%B8%82%E7%AC%AC%E4%B8%80%E4%BA%BA%E6%B0%91%E5%8C%BB%E9%99%A2&cliF3=Jinghai%20First%20People's%20Hospital&cliF4=%E7%8E%8B%E8%8F%B2%E8%8F%B2&cliF5=%E8%81%8C%E5%8A%A1%EF%BC%9A%E5%8A%A9%E7%90%86%E6%8A%A4%E5%A3%AB&cliF6=%E7%A7%91%E5%AE%A4%EF%BC%9A%E4%BD%8F%E9%99%A2%E9%83%A8&cliF7=%E7%BC%96%E5%8F%B7%EF%BC%9ANO-GT-043&sign=2f7ee4e4c678bde31a0345de23ea3d0e&return_file=
```

### 错误码

| 错误码 | 错误码取值 | 解决方案 |
| :--- | :--- | :--- |
| 200 | 成功 | 成功 |
| 400 | 请求的数据格式不符！ | 请检查参数正确性 |
| 40000 | 系统繁忙，请稍后再试 | 系统可能维护升级中，等待后续功能恢复 |
| 40001 | 参数错误 | 检查传递参数是否按照文档规范 |
| 40003 | 账户api key或secret不存在 | 检查 key/secret 是否正确，或是否开通了 API 权限 |

## 三、调用说明

- Beta 期间开通 API 的用户可长期免费调用。
- API 调用根据 IP 秒级并发 30 次，如需更高并发次数，可前往社区反馈。
