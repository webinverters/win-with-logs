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
  //makes a copy of itself
  if (self instanceof api) {
    Transport.call(this, self);
    Context.call(this, self);
    this.bunyanInstance = self.bunyanInstance;
    this.pubSubInstance = self.pubSubInstance;
  } else {
    Transport.call(this);//add transport to api
    Context.call(this);//add context to api
    this.bunyanInstance = bunyan || false;
    this.pubSubInstance = pubSub || false;
  }
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
api.logIt = function (level, msg, details) {
  var goalObj = {};
  if (this.goalInstance) {
    goalObj = this.goalInstance.goalContext
  }

  var temp = new RawLog(level, msg, details, this.fullContext, goalObj);//new up a RawLog object to hold log data.

  //we do this so RawLog can take care of merging the context with details without messing up the context.
  return RawLog.processLogWithBunyan.call(temp, this.bunyanInstance)
    .then(Transport.runActionsOnLogEntry.bind(this, temp));
};




api.prototype.log = function (msg, details) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "debug", msg, details)
};
api.prototype.warn = function (msg, details) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "warn", msg, details)
};
api.prototype.error = function (msg, details) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "error", msg, details)
};
api.prototype.debug = function (msg, details) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "debug", msg, details)
};
api.prototype.fatal = function (msg, details) {
  api.handleGoalIfItExist.call(this, msg, details);
  return api.logIt.call(this, "fatal", msg, details)
};


api.prototype.context = function (obj) {
  var temp = new api(this);
  Context.addContext.call(temp, obj);
  return temp;
};

api.prototype.module = function (moduleName, details) {
  var obj = {
    module: moduleName
  };
  obj = _.extend(obj, details);
  var temp = new api(this);
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
      return true;
    })
};

api.prototype.fail = function (error) {
  if (this.goal) {
    //get goal result and added it to object.
  }
  return api.prototype.failSuppressed.call(this, error)
    .then(function () {
      throw error
    })
};

api.prototype.rejectWithCode = function (errCode) {
  return function (err) {

    var temp = new ErrorReport(err, errCode, this.fullContext);

    return api.logIt.call(this, "error", "failure", temp)
      .then(function () {
        throw temp
      })
  }.bind(this)
};

api.prototype.addEventHandler = function (event, handler) {
  this.pubSubInstance.addEventHandler(event, handler)
};

api.prototype.goal = function (goalName, details) {

  var temp = new api(this);
  var goalContext = details || {};
  if (!goalContext.goalId) {
    goalContext.goalId = _.uniqueId(new Date().getTime())
  }
  Context.addContext.call(temp, goalContext);
  var goal = new Goal(goalName);
  api.addGoal.call(temp, goal);
  return temp;
};


// Extras:
api.prototype.timestamp = function (kind) {
  if (config.timestampFunc) return config.timestampFunc()
  if (!kind) return new Date().toISOString()
  if (kind=='epoch') return Math.floor(new Date().getTime()/1000)
  if (kind=='epochmill') return new Date().getTime()
}
