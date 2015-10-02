var logConfig = require('../interface').logConfig;
var fileConfig = require('../interface').fileConfig;
var logger = require('../logic').logger;

var bunyan = require('../helpers/bunyan');
var fsManager = require('../logic/fs-manager');

var _ = require('lodash');


module.exports = function (config) {


  var api;
  var fsEnabled=false;
  var fsInstance;
  var temp;

  if (config.app || config.name || config.component) {
    var loggingConfig = new logConfig(config.component, config.app, config.env);
    var bunyanInstance = new bunyan(loggingConfig);
     temp = new logger(loggingConfig, bunyanInstance);


  }
  if (config.logFilePath || config.maxLogFileSize || config.maxLogFiles) {
    var fsConfig = new fileConfig(config.logFilePath, config.maxLogFileSize, config.maxLogFiles)
    fsInstance = new fsManager(fsConfig)
    fsEnabled=true;

  }


  api = function () {};
  api.log = function (a) {
    return temp.log(a)
      .then(function(){
        if(fsEnabled){
          return fsInstance.write(a)
        }
      })
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



  return api;

};