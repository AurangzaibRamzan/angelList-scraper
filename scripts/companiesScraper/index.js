const _ = require('lodash');

const scrapeCompany = require('./company');
const scrapeJobs = require('./jobs');
const { getCompanies } = require('../../mongodb');

async function scrapeCompanies() {
  const companies = await getCompanies();
  const companiesLink = _.map(companies, 'url');
  for (let i = 0; i <= 0; i++) {
    const jobs = await scrapeJobs(companiesLink[i]);
    console.log(jobs);
    const jobLinks = _.map(jobs, 'link');
    console.log('scraped ', companiesLink[i],jobLinks);

  }
  // const companies = ['https://angel.co/company/stord', 'https://angel.co/company/remotionco'];
  // const company = await scrapeCompany(companies[1])
  // // 

  // console.log('scrape', {
  //   company,
  //   // jobs,
  // });
}


scrapeCompanies();

