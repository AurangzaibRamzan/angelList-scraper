const _ = require('lodash');
const connectMongo = require('./connect');

async function AddCompanyUrls(companies) {
  const db = await connectMongo();
  const Table = db.collection('companiesURl');
  return Table.insertMany(companies);
}

async function getCompanies(companies) {
  const db = await connectMongo();
  const Table = db.collection('companiesURl');
  return Table.find(companies).toArray();
}

async function saveDataInDB(data) {
  const db = await connectMongo();
  const Table = db.collection('scrappedData');
  return Table.insertOne(data);
}

module.exports = { AddCompanyUrls, getCompanies, saveDataInDB };
