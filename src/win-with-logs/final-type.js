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


function RawLog(level, msg, details, context,goalContext, opts) {
  if (typeof level !== "string") throw new Error("invalid log level argument");
  if (typeof msg !== "string") throw new Error("invalid msg argument");

  if (details && typeof details !== "object")
    details = {details: details}

  this.msg = msg;
  this.details = details || {};
  this.context = context || {};
  this.goalContext = goalContext || {};
  this.logLevel = level;
  this.logObject = {};
  this.logString = "";
  this.opts = opts || {}
}

RawLog.processLogWithBunyan = function (bunyanInstance) {
  this.opts.context = this.context
  this.opts.goalContext = this.goalContext
  return bunyanInstance.log(this.logLevel, this.msg, this.details, this.opts)
    .then(function (result) {
      this.logObject = result
      try {
        this.logString = JSON.stringify(result)
      }
      catch (ex) {
        console.log("CIRCULAR LOG OBJECT:", result)
        throw ex
      }
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

  // HACK to allow result to be passed into promise chain.
  this.result = this.result.bind(this)
  this.fail = this.fail.bind(this)
  this.failSuppressed = this.failSuppressed.bind(this)
};

function ErrorReport(err, errorCode, details) {
  this.what = errorCode;
  if (err && err.details && _.isObject(err.details))
    this.details = err.details

  if (_.isObject(details)) {
    this.details = _.merge(this.details || {},details || {})
  }

  this.history = [];

  if (err instanceof Error) {
    this.rootCause = err.message || err.toString()
  } else {
    this.rootCause = _.cloneDeep(errorCode)
  }

  if (err instanceof ErrorReport) {
    this.rootCause = _.cloneDeep(err.rootCause)
    this.history = err.history
    this.details = _.merge(this.details, err.details)
    this.history.push(_.cloneDeep(err))
  }

  if (err) this.err = _.cloneDeep(err)
}


module.exports = {
  Transport: Transport,
  RawLog: RawLog,
  Goal: Goal,
  Context: Context,
  ErrorReport:ErrorReport
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
