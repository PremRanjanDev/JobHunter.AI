import puppeteer from 'puppeteer';
import { login } from './linkedin/login.js';
import { applyJobsEasyApply } from './linkedin/easy-apply.js';
import { waitForTimeout } from './utils/common-utils.js';

async function applyFromLinkedIn(page, keyword, location) {
    console.log('Starting LinkedIn login process...');
    await login(page, true);
    console.log('Logged in to LinkedIn successfully.');

    // Perform the easy apply process
    console.log('Starting the Easy Apply process...');
    await applyJobsEasyApply(page, keyword, location);
}

async function apply() {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        dumpio: true,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    // Login to LinkedIn (restores or saves session)
    await applyFromLinkedIn(page, 'Java developer', 'Singapore');

    console.log('Easy apply finished. Keeping browser open (10 sec) for inspection.');
    await waitForTimeout(10000); // Keep the browser open for 10 seconds for inspection
    await browser.close();
}

apply().catch(err => {
    console.error('Error in apply function:', err);
    process.exit(1);
});
