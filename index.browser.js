var winWithLogs = require('./src/win-with-logs');

window._ = require('lodash');
window.p = require('bluebird');
window.winWithLogs = function (config) {
  return winWithLogs(config)
};
