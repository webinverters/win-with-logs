var winWithLogs = require('./src/api/final-api');

window._ = require('lodash');
window.p = require('bluebird');

window.winWithLogs = function (config) {

  config = config ? config : {};
  config = _.defaults(config, {
    name: 'DefaultComponent',
    app: 'DefaultApp',
    env: 'dev',
    isNode:false,
    silent:false,
    debug:false
  });

  var log = new winWithLogs(config);
  return log;
};