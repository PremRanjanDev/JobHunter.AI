import { JsonFile } from '../utils/json-utils.js'
import fs from 'fs';
import path from 'path';
import { waitForTimeout } from '../utils/common-utils.js';

const WAIT_FOR_CONTROL = 5000; // 5 seconds timeout for waiting for controls

export async function applyJobsEasyApply(page, keyword, location) {
    // Create an output file to log the job applications
    const outputDir = path.join('output', 'linkedin');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const currentTime = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
    const outputFile = path.join(outputDir, `easy_apply_${currentTime}.json`);
    const jsonFile = new JsonFile(outputFile);
    const applyInfo = {
        record: 'Apply info',
        keyword,
        location,
        timestamp: new Date().toISOString(),
    };
    jsonFile.append(applyInfo);

    const jobs = await fetchJobList(page, keyword, location);

    if (!jobs || jobs.length === 0) {
        console.log('No job listings found. Please check the job title and location.');
        return;
    }
    console.log(`Found ${jobs.length} job listings.`);

    for (const job of jobs) {
        await applyJob(page, job);
    }
}

async function fetchJobList(page, jobTitle, location, pageNumber = 1) {
    console.log(`Searching for jobs: ${jobTitle} in ${location}`);
    await page.goto(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}&f_AL=true`);

    if (pageNumber > 1) {
        const paginationSelector = `button[aria-label="Page ${pageNumber}"]`;
        try {
            await page.waitForSelector(paginationSelector, { timeout: WAIT_FOR_CONTROL });
            await page.click(paginationSelector, { timeout: WAIT_FOR_CONTROL });
            await waitForTimeout(2000); // Wait for the page to load after clicking
        } catch (e) {
            console.log(`Could not click pagination button for page ${pageNumber}: ${e}`);
        }
    }

    await waitForTimeout(2000);
    const jobInfoSelector = '.job-card-container--clickable';
    let jobs = await page.$$(jobInfoSelector);

    let prevJobLen = 0;
    while (jobs.length !== prevJobLen) {
        console.log(`Found ${jobs.length} jobs, scrolling to load more...`);
        prevJobLen = jobs.length;
        if (jobs.length > 0) {
            await jobs[jobs.length - 1].evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        }
        await waitForTimeout(1000);
        jobs = await page.$$(jobInfoSelector);
    }

    return jobs;
}

async function applyJob(page, job) {
    try {
        // Wait for the job details section
        const jobDetailsSection = await page.waitForSelector(
            'div[class*="job-details"], div[class*="jobs-details"], div[class*="job-view-layout"]',
            { timeout: WAIT_FOR_CONTROL }
        );
        let easyApplyButton = null;
        if (jobDetailsSection) {
            easyApplyButton = await jobDetailsSection.$('button[aria-label^="Easy Apply"]');
        }
        if (!easyApplyButton) {
            const appliedMessageElem = await page.$('.artdeco-inline-feedback--success .artdeco-inline-feedback__message');
            if (appliedMessageElem) {
                const appliedMessage = await appliedMessageElem.evaluate(el => el.innerText);
                console.log(`Already applied to this job. Status: ${appliedMessage.trim()}`);
                return false;
            }
            console.log('Already applied or Easy Apply button not found. Skipping this job.');
            return false;
        }
        await easyApplyButton.click();

        // Extract the DOM of the Easy Apply modal
        console.log('Extracting application form DOM...');
        const modalHtml = await page.$eval('.artdeco-modal__content', el => el.innerHTML);
        if (!modalHtml) {
            console.log('Could not extract the application form DOM. Skipping this job.');
            return false;
        }

        // Use the AI utility for form field extraction
        const fieldsInfo = await readJobFormByAI(modalHtml);
        console.log('AI returned the following fields info:');
        console.log(fieldsInfo);

        await page.waitForSelector('.artdeco-modal__content', { timeout: WAIT_FOR_CONTROL });

        // Fill out the application form (this part will be handled by AI fieldsInfo)
        return true;
    } catch (e) {
        console.log(`Error applying to job: ${e}`);
        return false;
    }
}
