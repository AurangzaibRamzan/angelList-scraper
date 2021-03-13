import asyncLib from 'async';

import scrapeJob from './scrape-job';

async function scrapeJobData(companyURL, callback) {
  const data = await scrapeJob(companyURL);
  return callback(null, data);
}

async function scrapeCompanyJobsDetails(jobLinks) {
  return new Promise((resolve, reject) => {
    asyncLib.series(
      jobLinks.map((jobURL) => (nextJob) => {
        scrapeJobData(jobURL, nextJob);
      }),
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    );
  });
}

export default scrapeCompanyJobsDetails;
