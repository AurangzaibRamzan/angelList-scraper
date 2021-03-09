const _ = require('lodash');

const getCompanies = require('./getCompanies');
const db = require('../../mongodb');

const timeout = 3000;

async function scrapeAngelList() {
  let pageData = [];
  for (let i = 0; i <= 1001; i++) {
    setTimeout(function () { }, timeout);
    const data = await getCompanies(i);

    _.forEach(data, (obj) => {
      _.get(obj, 'node.slug') && pageData.push({ name: _.get(obj, 'node.name'), url: `https://angel.co/company/${_.get(obj, 'node.slug')}` });
    });
    console.log(`page ${i} total data`, pageData.length);
    !_.isEmpty(pageData) && await db.AddCompanyUrls(pageData);
    pageData = [];
  }
}

scrapeAngelList();