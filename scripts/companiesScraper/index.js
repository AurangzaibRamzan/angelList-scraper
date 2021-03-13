const _ = require('lodash');
const asyncLib = require('async');

const scrapeCompany = require('./company');
const scrapeJobs = require('./jobs');
const scrapeDetailJobs = require('../jobsScraper');
const { getCompanies, addCompany } = require('../../mongodb');

async function scrapeCompanyData(companyURL, callback) {
  console.log('companyURL', companyURL);

  try {
    const companyData = await scrapeCompany(companyURL);
    const jobs = await scrapeJobs(companyURL);
    const jobsLinks = _.map(_.get(jobs, 'data'), 'link');
    const detailJobs = await scrapeDetailJobs(jobsLinks);
    await addCompany({ ...companyData, jobs: jobs, detailJobs });
  } catch (err) {
    console.log(`Error while scraping ${companyURL}`, err);
  } finally {
    return callback();
  }
}

async function scrapeCompanies() {
  const companies = await getCompanies();
  const companiesLinks = _.map(companies, 'url');

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
