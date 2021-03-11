const _ = require('lodash');
const getCompanies = require('./getCompanies');
const db = require('../../mongodb');

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

async function scrapeAngelList() {
  let pageData=[];
  for (let i = 841; i <= 1001; i++) {
    let delayF = await delay(rnd(1,6) * 1000);
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