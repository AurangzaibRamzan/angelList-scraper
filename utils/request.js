const _ = require('lodash');
const async = require('async');
const request = require('request');

const randomUseragent = require('random-useragent');
const config = require('../config.json');

const RETRIABLE_ERRORS = [
  'ECONNRESET',
  'ENOTFOUND',
  'ESOCKETTIMEDOUT',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  'EPIPE',
  'EAI_AGAIN',
];

const getProxyHostList = (function () {
  var proxy_host_list; // in-memory cache
  return function fetchProxyHostList(callback) {
    if (proxy_host_list) return callback(null, proxy_host_list);

    const { key, email } = _.get(config, 'blazingseollc', {});
    const URL = 'http://proxy.blazingseollc.com/endpoint/list.php';
    request({ url: URL, qs: { key, email } }, (err, resp, body) => {
      if (err) return callback(err);

      const { statusCode } = resp || {};
      if (statusCode < 200 || statusCode >= 300) {
        err = new Error(
          `getProxyHostList: failed to retrieve - got status: ${statusCode}`
        );
        return callback(err);
      }

      const list = _(body.split('\n')).map(_.trim).compact().value();
      if (_.isEmpty(list)) {
        err = new Error('getProxyHostList: proxy host list is empty');
        return callback(err);
      }

      proxy_host_list = list; // now set the cached list value
      return callback(null, proxy_host_list);
    });
  };
})();



const baseRequest = request.defaults({
  method: 'GET',
  gzip: true,
  forever: true,
  timeout: 60000,
  maxSockets: Infinity,
  agent: false,
  pool: { maxSockets: Infinity },
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.8',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

const doHTTP_base = function (proxy_host_list, opts_orig, callback) {
  async.retry(
    {
      times: 10,
      interval: (retryCount) => 50 * Math.pow(2, retryCount), // exponential backoff in milliseconds
      errorFilter: (err) => { console.log('err in proxy request: ', err); return err && _.includes(RETRIABLE_ERRORS, err.code) }, // should retry the request
    },
    (callback) => {


      const opts = _.cloneDeep(opts_orig);
      var ip = (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255));
      _.defaultsDeep(opts, {
        headers: {
          'User-Agent': randomUseragent.getRandom(),
          // TODO: "Referer": "", i.e. google? or the root of opts.url ? it should be randomized
        },
      });
      if (proxy_host_list) {
        // for testing the proxy headers, use "https://httpbin.org/headers"
        // opts.proxy = 'http://' + _.sample(proxy_host_list);
        const proxyDetails = _.sample(proxy_host_list).split(':');
        opts.proxy = `http://${proxyDetails[2]}:${proxyDetails[3]}@${proxyDetails[0]}:${proxyDetails[1]}`;
        opts.tunnel = true;
      }

      if (opts.headers.proxy && !opts.headers.proxyHeaderWhiteList) {
        // if using a proxy, we need to set proxyHeaderWhiteList
        opts.headers.proxyHeaderWhiteList = _.keys(opts.headers);
      }

      console.log('requesting: ', opts);
      baseRequest(opts, (err, resp, body) => {
        if (err) return callback(err);

        const { statusCode } = resp || {};

        if (statusCode < 200 || statusCode >= 300) {
          err = new Error(
            'Got a statusCode=' + statusCode + ' for: ' + opts_orig.url
          );
          err.json = { statusCode, opts }; // provide more details, i.e. maybe a UA or proxy is getting blocked
          return callback(err);
        }
        callback(null, body);
      });
    },
    callback
  );
};

const doHTTP = function (opts, no_proxy, callback) {
  if (no_proxy) {
    doHTTP_base(null, opts, callback);
    return;
  }
  getProxyHostList((err, proxy_host_list) => {
    if (err) return callback(err);
    doHTTP_base(proxy_host_list, opts, callback);
  });
};

module.exports = function (opts, callback) {
  const no_proxy = !!opts.widespread_no_proxy;
  opts = _.omitBy(opts, (val, key) => /^widespread/.test(key));

  return new Promise((resolve, reject) => {
    doHTTP(opts, no_proxy, (err, body) => {
      if (err) return reject(err);

      resolve(body);
    });
  });
};
