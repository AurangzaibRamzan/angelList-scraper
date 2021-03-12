const _ = require('lodash');

const scrapeCompany = require('./company');
const scrapeJobs = require('./jobs');
const { getCompanies, addCompany } = require('../../mongodb');
const jobScrapper = require('../jobsScraper/scrapeJob');

async function scrapeCompanies() {
  const companies = await getCompanies();
  const companiesLink = _.map(companies, 'url');
  for (let i = 0; i < 1; i++) {
    try {
      console.log('start scraping ', companiesLink[i])
      const companyData = await scrapeCompany(companiesLink[i])
      // const jobs = await scrapeJobs(companiesLink[i]);
      // const jobLinks = _.map(jobs, 'link');
      const jobsData = [];
      // for (let j = 0; j < 1; j++) {
      //   const job = await jobScrapper(jobLinks[j]);
      //   jobsData.push(job);
      // }
      const res = { ...companyData, jobs: jobsData };
      res && addCompany(res);
    } catch (e) {
      console.log(e);
    }
  }
  console.log('companies scraped')
}


scrapeCompanies();

