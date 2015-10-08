var transportType = require('../transport-type');
var contextType = require('../context-type');


function loggerApi(bunyan, context, transport) {
  if (typeof bunyan !== "object") throw new Error("invalid bunyan")

  this.bunyan = bunyan;
  this.context_data = new contextType(context);
  this.transport = new transportType(transport);


  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof loggerApi) {
    this.bunyan = arguments[0].bunyan;//shouldn't need to make a copy of bunyan since it's a provider.

    this.context_data = new contextType(arguments[0].context_data);
    this.transport = new transportType(arguments[0].transport);
  }
}


loggerApi.prototype.log = function () {
};
loggerApi.prototype.warn = function () {
};
loggerApi.prototype.debug = function () {
};
loggerApi.prototype.error = function () {
};
loggerApi.prototype.fatal = function () {
};
loggerApi.prototype.context = function (name) {

  var newContext = new contextType(this.context)
  newContext.addContext(name, "context")
  return new loggerApi(this.bunyan)
};

loggerApi.prototype.function = function (name) {
  var newContext = new contextType(this.context)
  newContext.addContext(name, "function");
  return new loggerApi(this.bunyan)
};
loggerApi.prototype.method = function (name) {
  var newContext = new contextType(this.context)
  newContext.addContext(name, "method");
  return new loggerApi(this.bunyan)
};
loggerApi.prototype.module = function (name) {
  var newContext = new contextType(this.context)
  newContext.addContext(name, "module");
  return new loggerApi(this.bunyan)
};

loggerApi.prototype.returnSuccess = function () {
  return new loggerApi
};
loggerApi.prototype.returnFailure = function () {
  return new loggerApi
};


module.exports = loggerApi;