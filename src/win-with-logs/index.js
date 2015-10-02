var logConfig = require('../interface').logConfig;
var fileConfig = require('../interface').fileConfig;
var logger = require('../logic').logger;

var bunyan = require('../helpers/bunyan');
var fsManager = require('../logic/fs-manager');

var _ = require('lodash');


module.exports = function (config) {

  var loggingConfig = new logConfig(config.component, config.app, config.env);
  var bunyanInstance = new bunyan(loggingConfig);
  var loggingInstance = new logger(loggingConfig, bunyanInstance);
  loggingInstance.addTransport(console.log)


  if (config.logFilePath || config.maxLogFileSize || config.maxLogFiles) {
    var fsConfig = new fileConfig(config.logFilePath, config.maxLogFileSize, config.maxLogFiles)
    var fsInstance = new fsManager(fsConfig)
    loggingInstance.addTransport(fsInstance.write.bind(fsInstance))
  }


  api = function (msg,details) {
    return loggingInstance.log(msg,details)
  };
  api.log = function (msg,details) {
    return loggingInstance.log(msg,details)
  };
  api.debug = function (msg,details) {
    return loggingInstance.debug(msg,details);
  };
  api.warn = function (msg,details) {
    return loggingInstance.warn(msg,details);
  };
  api.error = function (msg,details) {
    return loggingInstance.error(msg,details);
  };
  api.fatal = function (msg,details) {
    return loggingInstance.fatal(msg,details);
  }


  return api;

};