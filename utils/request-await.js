const _ = require('lodash');
const request = require('request');

async function requestAwait(options) {

  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}

module.exports = requestAwait;
