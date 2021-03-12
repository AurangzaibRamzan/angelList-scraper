const _ = require('lodash');

function request({ url }) {
  return new Promise((resolve, reject) => {
    for (let j = 0; j < 5; j++) {
      var exec = require('child_process').exec;
      var command = `curl -x "http://scraperapi:78a2fe8671711a00c911dd8a30dfe596@proxy-server.scraperapi.com:8001" -k "${url}"`;
      child = exec(command, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
          reject(error);
        }
        if (!stdout.includes('Request failed. You will not be charged for this request')) {
          return resolve(stdout);
        }
      });
    }

  });
}
module.exports = request;