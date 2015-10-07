var logConfig = require('../data-structures').log_config;
var fileConfig = require('../data-structures').file_config;
var context = require('../data-structures').context;
var transports = require('../data-structures').transports;

var logger = require('../factories').loggerApi;
var bunyan = require('../providers/bunyan');
var fsManager = require('../factories/fs-manager');
var debug = require('../helpers').debug;


module.exports = function (config) {

  var loggingConfig = new logConfig(config.component, config.app, config.env);
  var bunyanInstance = new bunyan(loggingConfig);
  var loggingInstance = new logger(bunyanInstance, new context([]), new transports([]));
  loggingInstance.addTransport(console.log)


  if (config.logFilePath || config.maxLogFileSize || config.maxLogFiles) {
    var fsConfig = new fileConfig(config.logFilePath, config.maxLogFileSize, config.maxLogFiles);
    var fsInstance = new fsManager(fsConfig)
    loggingInstance.addTransport(fsInstance.write.bind(fsInstance))
  }


  api = function (msg, details) {
    return loggingInstance.log(msg, details)
  };
  api.log = function (msg, details) {
    return loggingInstance.log(msg, details)
  };
  api.debug = function (msg, details) {
    return loggingInstance.debug(msg, details);
  };
  api.warn = function (msg, details) {
    return loggingInstance.warn(msg, details);
  };
  api.error = function (msg, details) {
    return loggingInstance.error(msg, details);
  };
  api.fatal = function (msg, details) {
    return loggingInstance.fatal(msg, details);
  };

  api.failure = function (err) {
    return loggingInstance.log("failure", debug(err));
  };
  api.success = function (success) {
    var wait = true;
    if (wait) {
      return loggingInstance.log("success", success)
        .then(function () {
          return success
        })
    } else {
      loggingInstance.log("success", success)
      return p.resolve(success)
    }
  };
  api.context = function (name) {
    return loggingInstance.context(name)
  }


  api.goal = function () {
    var temp = new goal();
    var m = {};
    _.extend(m, api, temp)
    //m.complete=function(successResult){
    //  var tempaa=temp.returnStatus(successResult);
    //
    //  return loggingInstance.log("success", tempaa)
    //    .then(function(){
    //      return successResult
    //    })
    //
    //};
    //m.failure=function(){
    //
    //};
    return m;

  };

  return api;

};