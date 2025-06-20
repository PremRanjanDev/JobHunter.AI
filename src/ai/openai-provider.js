import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getApiKey() {
    const keyPath = path.join(__dirname, '../../keys/openai-key.txt');
    if (!fs.existsSync(keyPath)) {
        throw new Error('OpenAI API key not found in keys/openai-key.txt');
    }
    const apiKey = fs.readFileSync(keyPath, 'utf-8').trim();
    if (!apiKey) {
        throw new Error('OpenAI API key file is empty');
    }
    return apiKey;
}

const client = new OpenAI({ apiKey: getApiKey() });

export async function getOpenAIResponse(prompt, model = 'gpt-4.1') {
    const response = await client.responses.create({
        model,
        input: prompt,
    });
    return response.output_text;
}

async function basicOpenAITest() {
    const output = await getOpenAIResponse('Write a one-sentence bedtime story about a unicorn.');
    console.log(output);
}
