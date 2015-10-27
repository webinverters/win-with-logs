var finalType = require('./final-type');
var Transport = finalType.Transport;//stores all actions and methods on logs.
var RawLog = finalType.RawLog;//store a universal copy of logging, between processing and transports.
var Context = finalType.Context;
var Goal = finalType.Goal;
var ErrorReport=finalType.ErrorReport;


module.exports = {
  Api: api
};

function api(bunyan, pubSub) {
  var self = arguments[0];
  this._id = 'wwl-'+_.uniqueId(new Date().getTime())

  //makes a copy of itself
  var tempInstance={
    apiType:true
  };

  if (self.apiType) {
    Transport.call(tempInstance, self);
    Context.call(tempInstance, self);
    tempInstance.bunyanInstance = self.bunyanInstance;
    tempInstance.pubSubInstance = self.pubSubInstance;
  } else {
    Transport.call(tempInstance);//add transport to api
    Context.call(tempInstance);//add context to api
    tempInstance.bunyanInstance = bunyan || false;
    tempInstance.pubSubInstance = pubSub || false;
  }
  addApi(tempInstance)
  return tempInstance
}
api.addGoal = function (goal) {
  if (!(goal instanceof Goal))throw new Error('invalid goal specified');
  this.goalInstance = goal;
};

api.handleGoalIfItExist = function (msg, details) {
  if (this.goalInstance) {
    Goal.addEntry.call(this.goalInstance, msg, details);
  }
};

//logger actions
api.logIt = function (level, msg, details, options) {
  var goalObj = {};
  if (this.goalInstance) {
    goalObj = this.goalInstance.goalContext
  }

  var temp = new RawLog(level, msg, details, this.fullContext, goalObj, options);//new up a RawLog object to hold log data.

  //we do this so RawLog can take care of merging the context
  // with details without messing up the context.

  return RawLog.processLogWithBunyan.call(temp, this.bunyanInstance)
    .then(Transport.runActionsOnLogEntry.bind(this, temp));
};


function addApi(obj){
  _.forEach(api.prototype,function(func,name){
    obj[name]=func.bind(obj)
  })
}


api.prototype.info = function (msg, details, options) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "info", msg, details, options)
};
api.prototype.log = function (msg, details, options) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "info", msg, details, options)
};
api.prototype.warn = function (msg, details, options) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "warn", msg, details, options)
};
api.prototype.error = function (msg, details, options) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "error", msg, details, options)
};
api.prototype.debug = function (msg, details, options) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "debug", msg, details, options)
};
api.prototype.fatal = function (msg, details, options) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "fatal", msg, details, options)
};


api.prototype.context = function (obj) {
  var temp = api(this);
  Context.addContext.call(temp, obj);
  return temp;
};

api.prototype.module = function (moduleName, details) {
  var obj = {
    module: moduleName
  };
  obj = _.extend(obj, details);
  var temp = api(this);
  Context.addContext.call(temp, obj);
  return temp;
}


api.prototype.result = function (resultValue) {
  var result = {successValue: resultValue};

  if (this.goalInstance) {
    var resultGoal = this.goalInstance.report("success")
    result.goalName = resultGoal.name;
    result.goalHistory = resultGoal.history;
    result.goalDuration = resultGoal.goalDuration;
    result.goalDetails = resultGoal.details;
  }

  return api.logIt.call(this, "debug", "success", result)
    .then(function () {
      return resultValue
    })
};

api.prototype.failSuppressed = function (error) {
  var result = {failure: error};
  if (this.goalInstance) {
    //keep objects shallow if we ant to see them in the logs....
    var resultGoal = this.goalInstance.report("failure")
    result.goalName = resultGoal.name;
    result.goalHistory = resultGoal.history;
    result.goalDuration = resultGoal.goalDuration;
    result.goalDetails = resultGoal.details;
  }
  return api.logIt.call(this, "error", "failure", result)
    .then(function () {
      return error;
    })
};

api.prototype.fail = function (error) {
  return api.prototype.failSuppressed.call(this, error)
    .then(function (error) {
      throw error
    })
};

api.prototype.rejectWithCode = function (errCode) {
  return function (err) {
    var errorReport = new ErrorReport(err, errCode, this.fullContext);
    return api.prototype.fail.call(this, errorReport)
  }.bind(this)
};

api.prototype.addEventHandler = function (event, handler) {
  this.pubSubInstance.addEventHandler(event, handler)
};

api.prototype.goal = function (goalName, details) {

  var temp =  api(this);
  var goalContext = details || {};
  if (!goalContext.goalId) {
    goalContext.goalId = _.uniqueId(new Date().getTime())
  }
  Context.addContext.call(temp, goalContext);
  var goal = new Goal(goalName);
  api.addGoal.call(temp, goal);

  return temp
};
api.prototype.method = api.prototype.goal

// Extras:
api.prototype.timestamp = function (kind) {
  if (config.timestampFunc) return config.timestampFunc()
  if (!kind) return new Date().toISOString()
  if (kind=='epoch') return Math.floor(new Date().getTime()/1000)
  if (kind=='epochmill') return new Date().getTime()
}

/**
 * Creates an error report.
 *
 * Please try to pass err as a property fo details, since the
 * third err param is being phased out.
 *
 * @param  {[type]} msg     [description]
 * @param  {[type]} details [description]
 * @param  {[type]} err     [description]
 * @return {[type]}         [description]
 */
api.prototype.errorReport = function (msg, details, err) {
  details = details || {}
  return new ErrorReport(err || details.err, msg, details)
};
