const _ = require('lodash');
const pLimit = require('p-limit');

const scrapeCompany = require('./company');
const scrapeJobs = require('./jobs');
const scrapeDetailJobs = require('../jobsScraper');
const { getCompanies, addCompany } = require('../../mongodb');

const limit = pLimit(8);

async function scrapeCompanyData(companyURL) {
  console.log('companyURL', companyURL);
  try {
    const companyData = await scrapeCompany(companyURL);
    const jobs = await scrapeJobs(companyURL);
    const jobsLinks = _.map(_.get(jobs, 'data'), 'link');
    await addCompany({ ...companyData, jobs: jobs });
    await scrapeDetailJobs(jobsLinks, companyURL);
  } catch (err) {
    console.log(`Error while scraping ${companyURL}`, err);
  }
}

async function scrapeCompanies() {
  const companies = await getCompanies();
  const companiesLinks = _.map(companies, 'url');
  await Promise.all(companiesLinks.map((companyURL) => limit(() => scrapeCompanyData(companyURL))));
  console.log('script end');
}

scrapeCompanies();
