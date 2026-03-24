import { testField } from "@lark-opdev/block-basekit-server-api";

async function run() {
  // 构造最小可用的上下文（绕过严格类型校验，仅用于本地测试）
  const context: any = {
    logID: "local-test",
    timeZone: "Asia/Shanghai",
    tenantKey: "test-tenant",
    fetch: (global as any).fetch,
    baseSignature: "test-signature",
  };

  // 复现用户提供的英文逗号（无空格）多链接输入
  const links = "https://img.alicdn.com/i1/263685747/O1CN01BpByKT1sKAtNvuXDe_!!263685747.jpg,https://img.alicdn.com/i1/263685747/O1CN01bbWtfs1sKAtPckZ8L_!!263685747.jpg,https://img.alicdn.com/i1/263685747/O1CN014m4GDF1sKAtRlqaqa_!!263685747.jpg,https://img.alicdn.com/i1/263685747/O1CN01d1Tb4c1sKAtTKj7CU_!!263685747.jpg,https://img.alicdn.com/i2/263685747/O1CN01nYF9qu1sKAtU2zdhk_!!263685747.jpg";

  await testField(
    {
      linksInput: links,
      separator: "",
    },
    context
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});