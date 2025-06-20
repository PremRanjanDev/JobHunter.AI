import { getOpenAIResponse } from './openai-provider.js';

function parseJsonResponse(text) {
    // Try to find a JSON code block
    let match = text.match(/```json\s*([\s\S]+?)\s*```/i);
    let jsonStr;
    if (match) {
        jsonStr = match[1];
    } else {
        // Fallback: try to find the first {...} or [...] block
        match = text.match(/({[\s\S]+})/) || text.match(/(\[[\s\S]+\])/);
        if (match) {
            jsonStr = match[1];
        } else {
            jsonStr = text;
        }
    }
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Error parsing JSON from AI response:', e);
        console.error('Raw response:', text);
        return null;
    }
}

function minifyHtml(html) {
    return html
        .replace(/[\n\r\t]+/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

export async function readJobInfoByAI(html) {
    const prompt =
        'Given the following HTML, parse and provide details like id, title, company, location, type, if applied, selector with job id attribute, etc. ' +
        'Return ONLY a valid JSON object with: id, title, company, location, type, applied, selector and any other relevant details. ' +
        'Do not include any explanation, markdown, or text before or after the JSON. ' +
        'HTML: ' + minifyHtml(html);
    const text = await getOpenAIResponse(prompt);
    return parseJsonResponse(text);
}

export async function readJobFormByAI(html) {
    const prompt =
        'Given the following HTML of a job application form, extract all input fields. ' +
        'For each field, return a JSON object with: selector (CSS selector), type (html control like text, radio, checkbox, etc.), ' +
        'label (the visible label or question text), and options (top 10 only, for radio/checkbox, as a list of label and selector). ' +
        'Return ONLY a valid JSON array of these objects, with NO explanation, markdown, or text before or after the JSON. ' +
        'HTML: ' + minifyHtml(html);
    const text = await getOpenAIResponse(prompt);
    return parseJsonResponse(minifyHtml(text));
}
