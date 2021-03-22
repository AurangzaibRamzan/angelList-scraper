const _ = require('lodash');
const pLimit = require('p-limit');

const scrapeJob = require('./scrapeJob');
const { addJob, getDetailedCompanies, getJob } = require('../../mongodb');

const limit = pLimit(5);

async function scrapeJobData(jobUrl) {
  console.log('jobUrl', jobUrl);
  try {
    const job = await getJob({ jobUrl: jobUrl });
    if (!(!_.isEmpty(job) && _.isArray(job) && _.get(job[0], 'title'))) {
      const data = await scrapeJob(jobUrl);
      if (!_.isEmpty(data)) {
        await addJob({ jobUrl: jobUrl, ...data });
      }
    }
  } catch (e) {
    console.log(`Error in ${jobUrl}`, e)
  }
}

async function scrapeJobs() {
  const companies = await getDetailedCompanies();
  const data = _.filter(_.map(companies, (obj) => {
    return obj.jobs.data;
  }), (obj) => {
    if (!_.isEmpty(obj)) return true;
    return false
  });
  const jobs = [].concat(...data);
  const jobsLink = _.map(jobs, 'link');
  console.log(`total jobs links`, jobsLink.length)
  await Promise.all(jobsLink.map((jobUrl) => limit(() => scrapeJobData(jobUrl))));
  console.log('script end');
}

scrapeJobs();

module.exports = scrapeJobs;
