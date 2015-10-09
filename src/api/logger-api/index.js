//
//
//var logMessageType = require('../../data-types/log-message-type');
//var transportType = require('../../data-types/transport-type');
//var contextType = require('../../data-types/context-type');
//
//
//function loggerApi(bunyan) {
//  if (typeof bunyan !== "object") throw new Error("invalid bunyan")
//
//  this.bunyan = bunyan;
//  this.context_data=new contextType;
//  this.transport = new transportType;
//
//  //type should be able to pass itself as a parameter
//  if (arguments.length == 1 && arguments[0] instanceof loggerApi) {
//    this.bunyan = arguments[0].bunyan;//shouldn't need to make a copy of bunyan since it's a provider.
//
//    this.context_data = new contextType(arguments[0].context_data);
//    this.transport = new transportType(arguments[0].transport);
//  }
//}
//
//loggerApi.prototype.add
//
//
//loggerApi.prototype.log = function () {
//};
//loggerApi.prototype.warn = function () {
//};
//loggerApi.prototype.debug = function () {
//};
//loggerApi.prototype.error = function () {
//};
//loggerApi.prototype.fatal = function () {
//};
//loggerApi.prototype.context = function (name) {
//
//  var newContext = new contextType(this.context)
//  newContext.addContext(name, "context")
//  return new loggerApi(this.bunyan)
//};
//
//loggerApi.prototype.function = function (name) {
//  var newContext = new contextType(this.context)
//  newContext.addContext(name, "function");
//  return new loggerApi(this.bunyan)
//};
//loggerApi.prototype.method = function (name) {
//  var newContext = new contextType(this.context)
//  newContext.addContext(name, "method");
//  return new loggerApi(this.bunyan)
//};
//loggerApi.prototype.module = function (name) {
//  var newContext = new contextType(this.context)
//  newContext.addContext(name, "module");
//  return new loggerApi(this.bunyan)
//};
//
//loggerApi.prototype.returnSuccess = function () {
//  return new loggerApi
//};
//loggerApi.prototype.returnFailure = function () {
//  return new loggerApi
//};
//
//
//module.exports = loggerApi;