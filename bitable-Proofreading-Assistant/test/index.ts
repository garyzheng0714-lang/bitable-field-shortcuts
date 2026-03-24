import { basekit } from '@lark-opdev/block-basekit-server-api';
import '../src/index';

// 测试字段捷径功能
async function testField() {
  console.log('字段捷径纠错助手测试开始...');
  
  // 这里可以添加具体的测试逻辑
  const testInput = {
    inputText: '这个文档需要拉甲一些内容',
    // 选择内置模型示例：
    model: { label: 'DeepSeek-V3', value: 'deepseek-v3' },
    // 测试“其他模型”示例（仅当上面 model.value === 'custom' 时生效）：
    // model: { label: '其他模型', value: 'custom' },
    // customModel: 'my-custom-model'
  };
  
  console.log('测试输入:', testInput);
  console.log('字段捷径已加载，可以在多维表格中使用');
}

testField().catch(console.error);

export default basekit;