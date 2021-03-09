var _ = require('lodash');
var connectMongo = require('./connect');

async function AddCompanyUrls(companies) {
  const db = await connectMongo();
  const Table = db.collection("companiesURl");
  return Table.insertMany(companies);
};


module.exports = { AddCompanyUrls };
