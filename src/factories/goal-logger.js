var logger = require('./logger');
var goal=require('./goal');


function goalLogger(bunyan,context,transportsInstance,name) {
  logger.call(this,arguments)
  var temp=new goal(name);

}
goalLogger.prototype=new logger;

goalLogger.prototype.goalComplete=function(){

}
goalLogger.prototype.goal

//extend goalLogger with


module.exports = m;