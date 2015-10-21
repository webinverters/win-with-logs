var _ = require('lodash');
/**
 * Transport class
 * @param self
 * @constructor
 */
function Transport(self) {
  this.actions = [];

  if (typeof self == "object" && typeof self.actions == "object") {
    this.actions = self.actions
  }
}
Transport.addAction = function (level, func) {
  if (typeof this.actions !== "object") throw new Error("you can only call this function on a Transport type");
  this.actions.push(new Action(level, func)) //new Action will validate the arguments.
};
Transport.runActionsOnLogEntry = function (RawLog) {
  if (typeof this.actions !== "object") throw new Error("you can only call this function on a Transport type");
  return p.map(this.actions, function (action) {
    action.func(RawLog)
  }.bind(this))
};
function Action(level, func) {
  if (typeof level !== "string") throw new Error("missing log level parameter");
  if (typeof func !== "function") throw new Error("missing function parameter");
  this.level = level;
  this.func = func;
}


function RawLog(level, msg, details, context,goalContext) {
  if (typeof level !== "string") throw new Error("invalid log level argument");
  if (typeof msg !== "string") throw new Error("invalid msg argument");
  if (typeof details !== "object" && typeof details !== "undefined") throw new Error("invalid details argument");

  this.msg = msg;
  this.details = details || {};
  this.context = context || {};
  this.goalContext = goalContext || {};
  this.logLevel = level;
  this.logObject = {};
  this.logString = "";
}

RawLog.processLogWithBunyan = function (bunyanInstance) {
  var tempDetails = _.merge({}, this.context,this.goalContext, this.details);
  return bunyanInstance.log(this.logLevel, this.msg, tempDetails)
    .then(function (result) {
      this.logObject = result;
      this.logString = JSON.stringify(result)
    }.bind(this))
};

function Goal(name, goalDetails) {
  this.goalContext = goalDetails || {};

  this.name = name;
  this.time = new Date().getTime();
  this.history = [];
}

Goal.addEntry = function (msg, details) {
  this.history.push({
    log: msg,
    logDetails: details,
    time: new Date().getTime() - this.time
  })

};
Goal.report = function (status) {

  var result = {
    goal: this.name,
    duration: new Date().getTime() - this.time,
    history: this.history
  };


  //if success, show a merged object and show a reduce history
  if (status == "success") {
    result.details = _.foldl(this.history, function (a, b) {
      return _.extend({}, a.logDetails, b.logDetails)
    });
    result.history = _.map(this.history, function (value) {
      return value.log
    })
  }

  if (status == "failure") {

  }
  return result;
};
Goal.prototype.addEntry = Goal.addEntry
Goal.prototype.report = Goal.report


function Context(self) {
  this.fullContext = {};
  //do a deep copy to remove any references to the old object.
  // especially important since there can be multiple instances of logger with different context
  if (typeof self == "object" && typeof self.fullContext == "object") {
    this.fullContext = _.cloneDeep(self.fullContext);
  }
}
Context.addContext = function (object) {
  this.fullContext = object
};


module.exports = {
  Transport: Transport,
  RawLog: RawLog,
  Goal: Goal,
  Context: Context
};


//grab line of source....
var e = function (e) {
  if (!e.stack) return {};
  var line = e.stack.split('\n')[1];
  return {
    file: line.match(/at .+? \((.+?:)/)[1],
    line: line.match(/:(.+?):/)[1],
    func: line.match(/at (.+?) /)[1]
  }
};


function ErrorReport(err, errorCode, context) {
  if (err instanceof Error) {
    this.what = errorCode;
    this.context = context;
    this.rootCause = false;
    this.history = [];

    return
  }
  if (err instanceof ErrorReport) {
    this.what = err.what;
    this.context = err.context;
    this.rootCause = err.rootCause;
    this.history = err.history;
    return
  }
  throw new Error("Invalid Param, you must pass an error or errorReport")
};

//not needed yet?


//
//// logic for filtering log levels
//var logLevels = ["fatal", "error", "warn", , "debug", "trace"];
//function filterLogLevel(requestLevel, currentLevel) {
//  var req = logLevels.indexOf(requestLevel);
//  var cur = logLevels.indexOf(currentLevel);
//  if (req < 0)return false;
//  return req >= cur;
//}


//temp.log("debug", "hello", {a: 1}).then(function (a) {
//  prettyStdOut.write(a)
//})
//temp.log("error", "hello", {
//  a: 1,
//  b: 2,
//  c: 3,
//  d: {a: 1, b: 2, c: 3, d: {a: 1, b: {a: 1, b: 2}}}
//}).then(function (a) {
//  prettyStdOut.write(a)
//})