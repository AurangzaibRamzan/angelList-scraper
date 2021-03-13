const _ = require('lodash');

function request({ url }) {
  return new Promise(async (resolve) => {
    const exec = require('child_process').exec;
    const command = `curl -x "http://scraperapi:78a2fe8671711a00c911dd8a30dfe596@proxy-server.scraperapi.com:8001" -k "${url}"`;
    exec(command, (error, stdout) => {
      if (error !== null) {
        console.log(`Request Error [${url}]`, error);
        return resolve();
      }

      if (
        stdout.includes(
          'Request failed. You will not be charged for this request'
        )
      ) {
        console.log(`Request Error [${url}]`, error);
        return resolve();
      }

      return resolve(stdout);
    });
  });
}

module.exports = request;
