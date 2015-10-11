var loggerApi = require('../logger-api');
var goalType = require('../../data-types/goal-type')
var _=require('lodash');

function goalApi(goalName, prop1, prop2, bunyan, transport) {

  this.bunyan = bunyan || false;
  this.transport = transport || false;
  this.goalName = goalName;
  this.prop1 = prop1;
  this.prop2 = prop2;

  if (arguments.length == 1 && arguments[0] instanceof goalApi) {
    this.name = _.cloneDeep(arguments[0].name)
    this.prop1 = _.cloneDeep(arguments[0].prop1)
    this.prop2 = _.cloneDeep(arguments[0].prop2)
    this.transport = arguments[0].transport;
    this.bunyan = arguments[0].bunyan;
  }

  loggerApi.call(this, this.bunyan, this.transport);
  goalType.call(this, this.goalName);

};

goalApi.prototype = _.extend({}, goalType.prototype);
goalApi.prototype.constructor = goalApi;

goalApi.prototype.log = function (msg) {
  if (typeof msg == "string") this.addEntry(msg);
  return loggerApi.prototype.log.apply(this, arguments)
};
goalApi.prototype.warn = function (msg) {
  if (typeof msg == "string") this.addEntry(msg);
  return loggerApi.prototype.warn.apply(this, arguments)
};
goalApi.prototype.debug = function (msg) {
  if (typeof msg == "string") this.addEntry(msg);
  return loggerApi.prototype.debug.apply(this, arguments)
};
goalApi.prototype.error = function (msg) {
  if (typeof msg == "string") this.addEntry(msg);
  return loggerApi.prototype.error.apply(this, arguments)
};
goalApi.prototype.fatal = function (msg) {
  if (typeof msg == "string") this.addEntry(msg);
  return loggerApi.prototype.fatal.apply(this, arguments)
};


goalApi.prototype.complete = function () {
  return loggerApi.prototype.log.call(this, "goalSuccess",this.report("success"))
}
goalApi.prototype.fail = function () {
  if (typeof msg == "string") this.addEntry(msg);
  return loggerApi.prototype.log.call(this, "goalFailure",this.report("failure"))
}


module.exports = goalApi;

