const _ = require('lodash');

function apiRequest({ url }, next) {
  const exec = require('child_process').exec;
  const command = `curl -x "http://scraperapi:78a2fe8671711a00c911dd8a30dfe596@proxy-server.scraperapi.com:8001" -k "${url}"`;
  exec(command, (error, stdout) => {
    if (error !== null) {
      console.log(`Request Error [${url}]`, error);
      return next();
    }

    return next(stdout);
  });
}

function myRequest(opts, next) {
  const MAX_TRIES = 5;
  function repeater(tryCount) {
    if (tryCount < MAX_TRIES) {
      apiRequest(opts, (data) => {
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
    }
  }
  repeater(0);
}

function request(options) {
  return new Promise((resolve) => {
    myRequest(options, (data) => {
      return resolve(data);
    });
  });
}

module.exports = request;
