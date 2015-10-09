var logMessageType = require('../../data-types/log-message-type');
var logger = require('../../class/logger')

/**
 * @class
 */
function loggerApi(bunyan, transport) {
  if (typeof bunyan !== "object") throw new Error("invalid bunyan")
  this.loggerInstance = new logger(bunyan);

  if (transport) {
    _.forEach(transport.actions, function (transportActions) {
      this.loggerInstance.addTransport.apply(this.loggerInstance, transportActions)
    }.bind(this))
  }


  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof loggerApi) {

    this.loggerInstance = arguments[0].loggerInstance;
  }
}


loggerApi.prototype.log = function () {
  var m = new logMessageType(arguments);
  return this.loggerInstance.logEntry(m, "log")
};
loggerApi.prototype.warn = function () {
  var m = new logMessageType(arguments);
  this.loggerInstance.logEntry(m, "warn")
};
loggerApi.prototype.debug = function () {
  var m = new logMessageType(arguments);
  this.loggerInstance.logEntry(m, "debug")
};
loggerApi.prototype.error = function () {
  var m = new logMessageType(arguments);
  this.loggerInstance.logEntry(m, "error")
};
loggerApi.prototype.fatal = function () {
  var m = new logMessageType(arguments);
  this.loggerInstance.logEntry(m, "fatal")
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


module.exports = loggerApi;