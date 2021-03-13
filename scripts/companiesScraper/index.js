const _ = require('lodash');

const { getCompanies } = require('../../mongodb');
const scrapeCompaniesInfo = require('./scrape-companies-info');
const scrapeCompaniesJobs = require('./scrape-companies-jobs');

async function scrapeCompanies() {
  try {
    console.log('Script Starts at ', new Date());

    const companies = await getCompanies();
    let companiesLinks = _.map(companies, 'url');
    // companiesLinks = companiesLinks.slice(0, 10);

    await scrapeCompaniesInfo(companiesLinks);
    await scrapeCompaniesJobs(companiesLinks);

    console.log('Script Completes at ', new Date());
  } catch (err) {
    console.log('Excpetion Error', err);
  }
}

scrapeCompanies();
