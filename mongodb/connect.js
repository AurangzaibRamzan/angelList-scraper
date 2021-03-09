var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var url = 'mongodb://localhost:27017';
const dbName = 'angelList';

function connectMongo() {
  return new Promise((res, rej) => {
    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      res(db);
      if (err) rej(err);
    });
  })
}



module.exports = connectMongo;

