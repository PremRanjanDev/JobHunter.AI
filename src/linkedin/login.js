import fs from 'fs';
import path from 'path';

const SESSION_FILE = path.join('user_data', 'linkedin_cookies.json');

export async function login(page, saveLogin = false) {
    // Restore cookies if session file exists
    if (fs.existsSync(SESSION_FILE)) {
        console.log('Restoring LinkedIn session from cookies...');
        const cookies = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
        await page.setCookie(...cookies);
    }

    console.log('Try navigating to LinkedIn feed...');
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });

    let currentUrl = page.url();
    if (currentUrl.includes('/feed')) {
        console.log('Already logged in to LinkedIn.');
    } else {
        console.log('Not logged in. Please log in manually in the opened browser window.');
        await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(() => window.location.href.includes('/feed'), { timeout: 120000 }); // Wait for up to 2 minutes for login
        console.log('Login successful.');
        if (saveLogin) {
            const cookies = await page.cookies();
            fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
            fs.writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2), 'utf-8');
            console.log('Session cookies saved.');
        }
    }
}
