var winWithLogs = require('./src/api/win-with-logs-api');

window._ = require('lodash');
window.p = require('bluebird');

window.winWithLogs = function (config) {

  var log = new winWithLogs(config);
  return log;
};