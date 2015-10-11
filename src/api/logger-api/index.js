var logMessageType = require('../../data-types/log-message-type');
var transportType = require('../../data-types/transport-type');
var logger = require('../../class/logger');
var _=require('lodash');

var debug=require('../../helpers/debug');

/**
 * @class
 */
function loggerApi(bunyan, transport) {
  if (typeof bunyan !== "object") throw new Error("invalid bunyan")
  this.loggerInstance = new logger(bunyan);

  this.transport=new transportType;
  if (transport) {
    this.transport=transport;
    _.forEach(this.transport.actions, function (transportActions) {
      this.loggerInstance.addTransport.call(this.loggerInstance, transportActions.func,transportActions.type,transportActions.level)
    }.bind(this))
  }


  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof loggerApi) {

    this.loggerInstance = arguments[0].loggerInstance;
    this.transport=arguments[0].transport;
    return
  }
}


loggerApi.prototype.log = function () {
  var m = new logMessageType(arguments);
  return this.loggerInstance.logEntry(m, "log")
};
loggerApi.prototype.warn = function () {
  var m = new logMessageType(arguments);
  return this.loggerInstance.logEntry(m, "warn")
};
loggerApi.prototype.debug = function () {
  var m = new logMessageType(arguments);
  return this.loggerInstance.logEntry(m, "debug")
};
loggerApi.prototype.error = function () {
  var m = new logMessageType(arguments);
  return this.loggerInstance.logEntry(m, "error")
};
loggerApi.prototype.fatal = function () {
  var m = new logMessageType(arguments);
  return this.loggerInstance.logEntry(m, "fatal")
};

loggerApi.prototype.context = function (name) {
  var newInstance = new loggerApi(this);
  newInstance.loggerInstance.addContext(name, "function");
  return newInstance
};

loggerApi.prototype.function = function (name) {
  var newInstance = new loggerApi(this);
  newInstance.loggerInstance.addContext(name, "function");
  return newInstance
};
loggerApi.prototype.method = function (name) {
  var newInstance = new loggerApi(this);
  newInstance.loggerInstance.addContext(name, "function");
  return newInstance
};
loggerApi.prototype.module = function (name) {
  var newInstance = new loggerApi(this);
  newInstance.loggerInstance.addContext(name, "function");
  return newInstance
};

loggerApi.prototype.rejectWithFailure=function(err){
  var m = new logMessageType("failure", debug(err));
  return this.loggerInstance.logEntry(m, "error")
};
loggerApi.prototype.returnSuccess=function(success){
  var m = new logMessageType("success", success);
  return this.loggerInstance.logEntry(m, "log")
    .then(function(){
      return success
    })
};


module.exports = loggerApi;