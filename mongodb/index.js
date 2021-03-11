var _ = require('lodash');
var connectMongo = require('./connect');

async function AddCompanyUrls(companies) {
  const db = await connectMongo();
  const Table = db.collection("companiesURl");
  return Table.insertMany(companies);
};


async function getCompanies(companies) {
  const db = await connectMongo();
  const Table = db.collection("companiesURl");
  return Table.find(companies).toArray();
};

module.exports = { AddCompanyUrls, getCompanies};
