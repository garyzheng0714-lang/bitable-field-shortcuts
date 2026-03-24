import { testField, createFieldContext } from "@lark-opdev/block-basekit-server-api";

async function run() {
    const context = (await createFieldContext()) as any;
    context.baseSignature = context.baseSignature || 'debug';
    testField({
        account: 100,
    }, context);
}

run();
