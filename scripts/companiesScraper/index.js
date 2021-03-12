const _ = require('lodash');
const asyncLib = require('async');

const { delay } = require('../../utils/delay');
const scrapeCompany = require('./company');
const scrapeJobs = require('./jobs');
const scrapeDetailJobs = require('../jobsScraper');
const { getCompanies, addCompany } = require('../../mongodb');

async function scrapeCompanyData(companyURL, callback) {
  console.log('companyURL', companyURL);
  const companyData = await scrapeCompany(companyURL);
  await delay(10000);
  const jobs = await scrapeJobs(companyURL)
  await delay(10000);
  const jobsLinks = _.map(_.get(jobs, 'data'), 'link').slice(0, 5);
  const detailJobs = await scrapeDetailJobs(jobsLinks);
  await addCompany({ ...companyData, jobs: jobs, detailJobs });
  return callback(null);
}

async function scrapeCompanies() {
  const companies = await getCompanies();
  const companiesLinks = _.map(companies, 'url').slice(0, 4);

  asyncLib.series(
    companiesLinks.map((companyURL) => (nextCompany) => {
      scrapeCompanyData(companyURL, nextCompany);
    }),
    () => {
      console.log('DONE!!');
    }
  );
}

scrapeCompanies();
