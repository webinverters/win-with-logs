var loggerApi = require('../logger-api');
var goal = require('../goal');


function goalApi(goalName, bunyan, context, transportsInstance) {
  this.goalInstance = new goal(goalName);

  loggerApi.call(this, bunyan, context, transportsInstance);

  //add goal to context;
  this.theContext.addContext(goalName, "goal");


}

goalApi.prototype.constructor = goalApi;


goalApi.prototype.log = function (msg, details) {
  if (typeof(msg == "string")) this.goalInstance.addEntry(msg)
  return loggerApi.prototype.log.call(this, msg, details)
};
goalApi.prototype.warn = function (msg, details) {
  if (typeof(msg == "string")) this.goalInstance.addEntry(msg)
  return loggerApi.prototype.log.call(this, msg, details)
};
goalApi.prototype.debug = function (msg, details) {
  if (typeof(msg == "string")) this.goalInstance.addEntry(msg)
  return loggerApi.prototype.log.call(this, msg, details)
};
goalApi.prototype.error = function (msg, details) {
  if (typeof(msg == "string")) this.goalInstance.addEntry(msg)
  return loggerApi.prototype.log.call(this, msg, details)
};
goalApi.prototype.fatal = function (msg, details) {
  if (typeof(msg == "string")) this.goalInstance.addEntry(msg)
  return loggerApi.prototype.log.call(this, msg, details)
};

goalApi.prototype.completeGoal=function(){
  var goal=this.goalInstance.report("success")
  return loggerApi.prototype.log.call(this, "success", goal)
};


module.exports = goalApi