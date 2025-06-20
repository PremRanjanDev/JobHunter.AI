import puppeteer from 'puppeteer';
import { login } from './linkedin/login.js';
import { applyJobsEasyApply } from './linkedin/easy-apply.js';

async function main() {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
              headless: false,
              slowMo: 50,
              dumpio: true,
              defaultViewport: null
            });
    const page = await browser.newPage();

    // Login to LinkedIn (restores or saves session)
    console.log('Starting LinkedIn login process...');
    await login(page, true);
    console.log('Logged in to LinkedIn successfully.');

    // Perform the easy apply process
    console.log('Starting the Easy Apply process...');
    await applyJobsEasyApply(page, 'Java developer', 'Singapore');

    console.log('Easy apply finished. Keeping browser open (10 sec) for inspection.');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Keep open for 10 seconds as an example
    await browser.close();
}

main().catch(err => {
    console.error('Error in main function:', err);
    process.exit(1);
});
