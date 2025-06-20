export async function waitForTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function parseJsonResponse(text) {
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

export function minifyHtml(html) {
    return html
        .replace(/[\n\r\t]+/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
}
