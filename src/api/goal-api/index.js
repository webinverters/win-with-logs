var loggerApi = require('../logger-api')

function goalApi(name, prop1, prop2, bunyan, context, transport) {
  this.name = name;
  this.prop1 = prop1;
  this.prop2 = prop2;
  loggerApi.call(this, bunyan, context, transport)


  if (arguments.length == 1 && arguments[0] instanceof goalapi) {
    this.name = _.cloneDeep(arguments[0].name)
    this.prop1 = _.cloneDeep(arguments[0].prop1)
    this.prop2 = _.cloneDeep(arguments[0].prop2)
  }
};

goalApi.prototype = _.extend({}, loggerApi.prototype);
goalApi.prototype.context=null;
goalApi.prototype.constructor = goalApi;
goalApi.prototype.completeGoal=function(){}
goalApi.prototype.failGoal=function(){}


module.exports = goalApi;

