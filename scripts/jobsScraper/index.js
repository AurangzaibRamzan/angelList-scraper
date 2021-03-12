const asyncLib = require('async');

const scrapeJob = require('./scrapeJob');

async function scrapeJobData(companyURL, callback) {
  const data = await scrapeJob(companyURL);
  return callback(null, data);
}

async function scrapeJobs(jobLinks) {
  return new Promise((resolve, reject) => {
    asyncLib.series(
      jobLinks.map((jobURL) => (nextJob) => {
        scrapeJobData(jobURL, nextJob);
      }),
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    )
  })
}

module.exports = scrapeJobs;
