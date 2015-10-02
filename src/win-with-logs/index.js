var logConfig = require('../interface').logConfig;
var fileConfig = require('../interface').fileConfig;
var logger = require('../logic').logger;

var bunyan = require('../helpers/bunyan');
var fsManager = require('../logic/fs-manager');

var _ = require('lodash');


module.exports = function (config) {


  var api;
  var fsInstance;
  var loggingInstance = new logger(loggingConfig, bunyanInstance);

  if (config.app || config.name || config.component) {
    var loggingConfig = new logConfig(config.component, config.app, config.env);
    var bunyanInstance = new bunyan(loggingConfig);
    loggingInstance = new logger(loggingConfig, bunyanInstance);
    loggingInstance.addTransport(console.log)


  }
  if (config.logFilePath || config.maxLogFileSize || config.maxLogFiles) {
    var fsConfig = new fileConfig(config.logFilePath, config.maxLogFileSize, config.maxLogFiles)
    fsInstance = new fsManager(fsConfig)
    loggingInstance.addTransport(fsInstance.write.bind(fsInstance))
  }


  api = function () {
  };
  api.log = function (a) {
    return loggingInstance.log(a)
  };
  api.debug = function (a) {
    return loggingInstance.debug(a);
  };
  api.warn = function (a) {
    return loggingInstance.warn(a);
  };
  api.error = function (a) {
    return loggingInstance.error(a);
  };
  api.fatal = function (a) {
    return loggingInstance.fatal(a);
  }


  return api;

};