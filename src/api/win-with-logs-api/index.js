var loggerApi = require('../logger-api');
var goalApi = require('../goal-api');
var bunyan = require('../../providers/bunyan');
var transport = require('../../data-types/transport-type');
var pubSub = require('../../providers/pub-sub');
var _=require('lodash')

var fsProvider=require('../../providers/fs');


function api(config) {

  if(config.app || config.env || config.component){

    if (typeof config.app !== "string") throw new Error("invalid param");
    if (typeof config.env !== "string") throw new Error("invalid param");
    if (typeof config.component !== "string") throw new Error("invalid param");

  }

  this.bunyanInstance = new bunyan(config);

  this.transportInstance = new transport;
  this.transportInstance.addTransport(function (a) {
    console.log(a.logString)
  }, "log", "debug")
  this.pubSubInstance = new pubSub;


  this.transportInstance.addTransport(function (a) {
    if (a && a.args && a.args.msg && typeof a.args.msg[0] == "string" && a.args.msg[0][0] == "@") {
      this.pubSubInstance.handleEvent(a.args.msg[0])
    }
  }.bind(this), "log", "debug");


  //add fs provider
  if(config.logFilePath || config.maxLogFileSize || config.maxLogFiles){

    if (typeof config.logFilePath !== "string") throw new Error("invalid param");
    if (typeof config.maxLogFileSize !== "number") throw new Error("invalid param");
    if (typeof config.maxLogFiles !== "number") throw new Error("invalid param");

    var fsInstance = new fsProvider({
      logFilePath: config.logFilePath,
      maxLogFileSize: config.maxLogFileSize,
      maxLogFiles: config.maxLogFiles
    })

    this.transportInstance.addTransport(function (a) {
      return fsInstance.write(a.logString)
    }.bind(this), "log", "debug");

  }



  loggerApi.call(this, this.bunyanInstance, this.transportInstance)



}


api.prototype = _.extend({}, loggerApi.prototype)
api.prototype.constructor = api;

api.prototype.goal = function (goalName, prop1, prop2) {
  var temp=new goalApi(goalName, prop1, prop2, this.bunyanInstance, this.transportInstance)
  return temp;
};
api.prototype.addEventHandler = function (event, handler) {
  this.pubSubInstance.addEventHandler(event, handler);
};


module.exports = api;

