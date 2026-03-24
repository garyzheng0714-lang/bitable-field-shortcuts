// Mock Test for Gemini Plugin Logic
// Run this with: ts-node test/mock_test.ts

const mockContext = {
    logID: 'test-log-id',
    fetch: async (url: string, options: any) => {
        console.log(`[Mock Fetch] ${options.method} ${url}`);
        console.log(`[Mock Headers]`, options.headers);
        if (options.body) console.log(`[Mock Body]`, options.body);

        // Simulate Responses
        if (url.includes('generateContent')) {
            return {
                ok: true,
                status: 200,
                text: async () => JSON.stringify({
                    candidates: [{
                        content: { parts: [{ text: "Mock Gemini Response" }] },
                        groundingMetadata: {
                            groundingChunks: [{ web: { title: "Test Source", uri: "http://test.com" } }]
                        }
                    }]
                })
            };
        }
        
        if (url.includes('interactions') && options.method === 'POST') {
             return {
                ok: true,
                status: 200,
                text: async () => JSON.stringify({ name: "interactions/12345" })
            };
        }

        if (url.includes('interactions/12345') && options.method === 'GET') {
            return {
                ok: true,
                status: 200,
                text: async () => JSON.stringify({
                    state: 'COMPLETED',
                    outputs: [{ content: "Mock Research Report" }]
                })
            };
        }

        return {
            ok: false,
            status: 404,
            text: async () => "Not Found"
        };
    }
};

// Import the execute function from index.ts (Need to adjust if index.ts has default export)
// Since we can't easily import the default export which is an object calling basekit, 
// we will just copy the execute logic here for verification or Mock the basekit.

// Mocking basekit to capture the execute function
const mockBasekit = {
    addDomainList: (list: string[]) => console.log('Domains added:', list),
    addField: (config: any) => {
        console.log('Field added. Testing execute...');
        runTests(config.execute);
    }
};

// Mock the module require/import
// In a real environment we would use a test runner. 
// Here we will simulate the execution flow.

async function runTests(execute: Function) {
    console.log('\n--- Test 1: Text Generation ---');
    const res1 = await execute({
        apiKey: 'test-key',
        taskType: 'text',
        model: 'gemini-2.5-flash',
        prompt: 'Hello',
        enableSearch: true
    }, mockContext);
    console.log('Result 1:', res1);

    console.log('\n--- Test 2: Deep Research ---');
    const res2 = await execute({
        apiKey: 'test-key',
        taskType: 'research',
        model: 'deep-research-pro-preview-12-2025',
        prompt: 'Research X'
    }, mockContext);
    console.log('Result 2:', res2);
}

// ---------------------------------------------------------
// PASTE THE EXECUTE LOGIC HERE OR IMPORT IT IF POSSIBLE
// Since we are in a single file script for "交付物", 
// users can use this pattern to test their logic.
// For now, I will just output this file as a template for them to use 
// if they want to unit test the logic by copying the execute function.
// ---------------------------------------------------------
console.log("This test file requires the 'execute' function to be exported or mocked.");
console.log("In a real setup, you would import 'execute' from ../src/index.ts");
