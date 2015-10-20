var finalType = require('./final-type');
var Transport = finalType.Transport;//stores all actions and methods on logs.
var RawLog = finalType.RawLog;//store a universal copy of logging, between processing and transports.
var Context=finalType.Context;
//var Goal=finalType.Goal;


function api(bunyan,pubSub) {

  var self=arguments[0];
  //makes a copy of itself
  if (self instanceof api) {
    Transport.call(this, self);
    Context.call(this, self);
    this.bunyanInstance = self.bunyanInstance;
    this.pubSubInstance=self.pubSubInstance;
  } else {
    Transport.call(this);//add transport to api
    Context.call(this);//add context to api
    this.bunyanInstance = bunyan||false;
    this.pubSubInstance=pubSub||false;
  }
}



//logger actions
api.logIt = function (level, msg, details) {
  var temp = new RawLog(level, msg, details, this.fullContext);//new up a RawLog object to hold log data.

  //we do this so RawLog can take care of merging the context with details without messing up the context.
  return RawLog.processLogWithBunyan.call(temp, this.bunyanInstance)
    .then(Transport.runActionsOnLogEntry.bind(this, temp));
};


api.prototype.log = function (msg, details) {
  return api.logIt.call(this, "debug", msg, details)
};
api.prototype.warn = function (msg, details) {
  return api.logIt.call(this, "warn", msg, details)
};
api.prototype.error = function (msg, details) {
  return api.logIt.call(this, "error", msg, details)
};
api.prototype.debug = function (msg, details) {
  return api.logIt.call(this, "debug", msg, details)
};
api.prototype.fatal = function (msg, details) {
  return api.logIt.call(this, "fatal", msg, details)
};
api.prototype.context = function (obj) {
  var temp = new api(this);
  Context.addContext.call(temp, obj);
  return temp;
};

api.prototype.result = function (resultValue) {
  //for consistently, details is always an object.
  return this.log("success", {successValue: resultValue})
    .then(function () {
      return resultValue
    })
};
api.prototype.fail = function (error) {
  return this.error("failure", {failure: error})
    .then(function () {
      throw error
    })
};
api.prototype.failSuppressed = function (error) {
  return this.error("failure", {failure: error})
};
api.prototype.rejectWithCode = function (errCode) {
  return function (err) {
    if (err instanceof Error) {
      console.log("you have an error!!!")
    }
  }

};


api.prototype.goal = function (goal, details) {

};



module.exports={
  Api:api
};