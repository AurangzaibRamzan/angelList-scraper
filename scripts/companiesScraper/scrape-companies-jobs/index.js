const _ = require('lodash');
const asyncLib = require('async');

const { delay } = require('../../../utils/delay');
const { saveDataInDB } = require('../../../mongodb');
const scrapeCompanyJobs = require('./scrape-company-jobs');

async function scrapeCompanyJobsData(companyURL, next) {
  if (!companyURL) return next();

  try {
    console.log('Scraping Company Jobs', companyURL);
    const jobsData = await scrapeCompanyJobs(companyURL);
    if (jobsData) {
      await saveDataInDB({ nature: 'companyJobs', companyURL, ...jobsData });
    }
  } catch (err) {
    console.log(`Error while scraping ${companyURL} jobs`, err);
  } finally {
    await delay(3000);
    return next();
  }
}


function scrapeCompaniesJobs(companiesLinks) {
  return new Promise((resolve) => {
    if (!companiesLinks || !companiesLinks.length) return resolve();
    asyncLib.parallelLimit(
      companiesLinks.map((companyURL) => (nextCompany) => {
        scrapeCompanyJobsData(companyURL, nextCompany);
      }),
      3,
      () => resolve()
    );
  });
}

module.exports = scrapeCompaniesJobs;
