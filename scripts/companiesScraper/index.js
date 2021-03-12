const _ = require('lodash');
const asyncLib = require('async');

const { delay } = require('../../utils/delay');
const scrapeCompany = require('./company');
const { getCompanies, addCompany } = require('../../mongodb');

async function scrapeCompanyData(companyURL, callback) {
  console.log('companyURL', companyURL);
  const companyData = await scrapeCompany(companyURL);
  await addCompany(companyData);
  await delay(10000);
  return callback();
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
