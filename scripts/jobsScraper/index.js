const asyncLib = require('async');
const _ = require('lodash');

const scrapeJob = require('./scrapeJob');
const { addJob } = require('../../mongodb');

async function scrapeJobData(jobURL, companyURL, callback) {
  const data = await scrapeJob(jobURL);
  if (!_.isEmpty(data)) {
    await addJob({ comapnyUrl: companyURL, jobUrl: jobURL, ...data });
  }
  return callback(null, data);
}

async function scrapeJobs(jobLinks, companyURL) {
  return new Promise((resolve, reject) => {
    asyncLib.series(
      jobLinks.map((jobURL) => (nextJob) => {
        scrapeJobData(jobURL, companyURL, nextJob);
      }),
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    )
  })
}

module.exports = scrapeJobs;
