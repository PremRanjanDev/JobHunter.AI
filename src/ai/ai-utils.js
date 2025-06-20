import { minifyHtml, parseJsonResponse } from '../utils/common-utils.js';
import { getOpenAIResponse } from './openai-provider.js';

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
