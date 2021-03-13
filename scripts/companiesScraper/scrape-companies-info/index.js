const _ = require('lodash');
const asyncLib = require('async');

const { delay } = require('../../../utils/delay');
const { saveDataInDB } = require('../../../mongodb');
const scrapeCompanyInfo = require('./scrape-company-info');

async function scrapeCompanyInfoData(companyURL, next) {
  if (!companyURL) return next();

  try {
    console.log('Scraping Company Info', companyURL);
    const data = await scrapeCompanyInfo(companyURL);
    if (data) {
      await saveDataInDB({ nature: 'companyInfo', companyURL, ...data });
    }
  } catch (err) {
    console.log(`Error while scraping ${companyURL} info`, err);
  } finally {
    await delay(3000);
    return next();
  }
}

function scrapeCompaniesInfo(companiesLinks) {
  return new Promise((resolve) => {
    if (!companiesLinks || !companiesLinks.length) return resolve();
    asyncLib.parallelLimit(
      companiesLinks.map((companyURL) => (nextCompany) => {
        scrapeCompanyInfoData(companyURL, nextCompany);
      }),
      4,
      () => resolve()
    );
  });
}

module.exports = scrapeCompaniesInfo;
