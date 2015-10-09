var loggerApi = require('../logger-api');

function pubSub(){}
pubSub.prototype.addEventHandler=function(){};


function api(bunyan,context,transport) {
  loggerApi.call(this,bunyan)
  pubSub.call(this);

  if (arguments.length == 1 && arguments[0] instanceof api) {
    //this.fullContext = _.cloneDeep(arguments[0].fullContext)
  }
}


api.prototype= _.extend({},loggerApi.prototype,pubSub.prototype)
api.prototype.constructor=api;






module.exports = api;

