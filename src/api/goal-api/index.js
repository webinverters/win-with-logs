var loggerApi = require('../logger-api');
var goalType=require('../../data-types/goal-type')

function goalApi(goalName,bunyan,transport) {

  loggerApi.call(this, bunyan, transport)



  if (arguments.length == 1 && arguments[0] instanceof goalApi) {
    //this.name = _.cloneDeep(arguments[0].name)
    //this.prop1 = _.cloneDeep(arguments[0].prop1)
    //this.prop2 = _.cloneDeep(arguments[0].prop2)
  }
};

goalApi.prototype = _.extend({}, loggerApi.prototype);


goalApi.prototype.constructor = goalApi;


goalApi.prototype.complete=function(){}
goalApi.prototype.fail=function(){}


module.exports = goalApi;

