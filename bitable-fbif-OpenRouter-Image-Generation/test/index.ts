import { createFieldContext, testField } from '@lark-opdev/block-basekit-server-api';

async function run() {
  const context = await createFieldContext();
  await testField(
    {
      model: { label: 'Gemini 3 Pro Image Preview', value: 'google/gemini-3-pro-image-preview' },
      prompt: 'A cyberpunk street with rain at night, cinematic lighting',
      api_key: 'sk-or-v1-REPLACE_ME'
    },
    context as any
  );
}

run();
