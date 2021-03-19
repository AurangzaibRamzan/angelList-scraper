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

async function getCompany(company) {
  const db = await connectMongo();
  const Table = db.collection("companies");
  return Table.find(company).toArray();
};

async function getJob(job) {
  const db = await connectMongo();
  const Table = db.collection("jobs");
  return Table.find(job).toArray();
};

async function getDetailedCompanies(companies) {
  const db = await connectMongo();
  const Table = db.collection("companies");
  return Table.find(companies).toArray();
};

async function addCompany(company) {
  const db = await connectMongo();
  const Table = db.collection("companies");
  return Table.insertMany([company]);
};

async function addJob(company) {
  const db = await connectMongo();
  const Table = db.collection("jobs");
  return Table.insertMany([company]);
};

module.exports = {
  AddCompanyUrls,
  getCompanies, addCompany, addJob, getCompany, getDetailedCompanies, getJob
};
