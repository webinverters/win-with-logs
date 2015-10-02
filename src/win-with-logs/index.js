var logConfig = require('../interface').logConfig;
var fileConfig = require('../interface').fileConfig;
var logger = require('../logic').logger;

var bunyan = require('../helpers/bunyan');
var fsManager = require('../logic/fs-manager');

var _ = require('lodash');


module.exports = function (config) {


  var api;

  if (config.app || config.name || config.component) {
    var loggingConfig = new logConfig(config.component, config.app, config.env);
    var bunyanInstance = new bunyan(loggingConfig);
    var temp = new logger(loggingConfig, bunyanInstance);

    api = function () {
    };
    api.log = function (a) {
      return temp.log(a);
    };
    api.debug = function (a) {
      return temp.debug(a);
    };
    api.warn = function (a) {
      return temp.warn(a);
    };
    api.error = function (a) {
      return temp.error(a);
    };
    api.fatal = function (a) {
      return temp.fatal(a);
    }
  }
  if (config.logFilePath || config.maxLogFileSize || config.maxLogFiles) {
    var fsConfig = new fileConfig(config.logFilePath, config.maxLogFileSize, config.maxLogFiles)
    var fsInstance = fsManager(fsConfig)

  }

  return api;

};