import Bull = require('bull');
import { JobQueueName } from '../..';
import path from 'path';
import fs from 'fs';
import { redisConnectionConfig } from '../../../redis';

const processTypescriptPath = path.join(__dirname, './process.ts');
const processJavascriptPath = path.join(__dirname, './process.js');
const processFileName = fs.existsSync(processTypescriptPath)
    ? processTypescriptPath
    : processJavascriptPath;

// Bull website quick guide
// https://optimalbits.github.io/bull/

// Quick guide creating queue
// https://github.com/OptimalBits/bull#quick-guide
export const gdOrgReviewScraperJobQueue = new Bull(
    JobQueueName.GD_ORG_REVIEW_SCRAPER_JOB,
    {
        redis: redisConnectionConfig
    }
);

gdOrgReviewScraperJobQueue.process(processFileName);

// Events API
// https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#events
gdOrgReviewScraperJobQueue.on('error', function (error) {
    // An error occured.
    console.error('error');
});

gdOrgReviewScraperJobQueue.on('waiting', function (jobId) {
    // A Job is waiting to be processed as soon as a worker is idling.
    console.log('waiting');
});

gdOrgReviewScraperJobQueue.on('active', function (job, jobPromise) {
    // A job has started. You can use `jobPromise.cancel()`` to abort it.
    console.log('active');
});

gdOrgReviewScraperJobQueue.on('stalled', function (job) {
    // A job has been marked as stalled. This is useful for debugging job
    // workers that crash or pause the event loop.
    console.log('stalled');
});

gdOrgReviewScraperJobQueue.on('progress', function (job, progress) {
    // A job's progress was updated!
    console.log('progress');
});

gdOrgReviewScraperJobQueue.on('completed', function (job, result) {
    // A job successfully completed with a `result`.
    console.log('completed');
});

gdOrgReviewScraperJobQueue.on('failed', function (job, err) {
    // A job failed with reason `err`!
    console.error('failed', err);
});

gdOrgReviewScraperJobQueue.on('paused', function () {
    // The queue has been paused.
    console.log('paused');
});

gdOrgReviewScraperJobQueue.on('resumed', function (job: Bull.Job<any>) {
    // The queue has been resumed.
    console.log('resumed');
});

gdOrgReviewScraperJobQueue.on('cleaned', function (jobs, type) {
    // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
    // jobs, and `type` is the type of jobs cleaned.
    console.log('cleaned');
});

gdOrgReviewScraperJobQueue.on('drained', function () {
    // Emitted every time the queue has processed all the waiting jobs (even if there can be some delayed jobs not yet processed)
    console.log('drained');
});

gdOrgReviewScraperJobQueue.on('removed', function (job) {
    // A job successfully removed.
    console.log('removed');
});
