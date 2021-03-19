const _ = require('lodash');
const pLimit = require('p-limit');

const scrapeCompany = require('./company');
const scrapeJobs = require('./jobs');
const { getCompanies, addCompany, getCompany } = require('../../mongodb');

const limit = pLimit(5);

async function scrapeCompanyData(companyURL) {
  console.log('companyURL', companyURL);
  try {
    const company = await getCompany({ url: companyURL });
    if (!(!_.isEmpty(company) && _.isArray(company) && _.get(company[0], 'name'))) {
      const companyData = await scrapeCompany(companyURL);
      const jobs = await scrapeJobs(companyURL);
      if (!_.isEmpty(companyData)) {
        await addCompany({ ...companyData, jobs: jobs });
      }
    }
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
