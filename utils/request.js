const _ = require('lodash');
const { delay } = require('./delay');
const timeout = 50 * 1000;


async function apiRequest({ url }, next) {
  const exec = require('child_process').exec;
  await delay(1000);
  const command = `curl -x "http://scraperapi:78a2fe8671711a00c911dd8a30dfe596@proxy-server.scraperapi.com:8001" -k "${url}"`;
  var options = {
    timeout,
  }

  exec(command, options, (error, stdout) => {
    if (error !== null) {
      console.log(`Request Error [${url}]`, error);
      return next(null, error);
    }
    return next(stdout);
  });
}

function myRequest(opts, next) {
  const MAX_TRIES = 3;
  function repeater(tryCount) {
    if (tryCount < MAX_TRIES) {
      apiRequest(opts, (data, error) => {
        if (error) {
          return repeater(tryCount + 1);
          // return next(null, `Request failed: timeout after ${timeout / 1000} sec`)
        };
        if (!data) return next();
        if (
          data.includes(
            'Request failed. You will not be charged for this request'
          )
        ) {
          return repeater(tryCount + 1);
        } else {
          return next(data);
        }
      });
    } else {
      next(null, `Request failed: after retry ${MAX_TRIES}`);
    }
  }
  repeater(0);
}

function request(options) {
  return new Promise((resolve, reject) => {
    myRequest(options, (data, error) => {
      if (error) reject(error);
      return resolve(data);
    });
  });
}
module.exports = request;