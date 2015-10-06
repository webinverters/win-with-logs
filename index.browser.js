var winWithLogs = require('./src/win-with-logs');
var _ = require('lodash');
var p=require('bluebird');


window.winWithLogs = function (config) {
  return winWithLogs(config)
};
