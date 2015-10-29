/**
 * @module logger
 * @summary: Provides a logger instance.
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-10-28.
 * @license Apache-2.0
 */

 try {
     /* Use `+ ''` to hide this import from browserify. */
     var sourceMapSupport = require('source-map-support' + '');
 } catch (_) {
     sourceMapSupport = null;
 }

 var _ = require('lodash')
 var p = require('bluebird')


module.exports = function(config, deps) {
  var m = post.bind(null,'info'), _context = deps.context || {}
  _context = _.defaults(_context, {
    observers: {}
  })

  var log = deps.log

  function post(level, msg, details, options) {
    if (!log[level]) throw new Error("invalid log level:"+level);
    var deferredStreamProcessing = p.defer()
    var logObject = {
      _id: parseInt(_.uniqueId())
    }

    deps.logStreamCompletionPromises[logObject._id] = {
      finalDef: deferredStreamProcessing,
      eventHandlingCompleted: m.processEventHandlers(msg, details, options),
      promises: []
    }

    if (details instanceof Error && !(details instanceof ErrorReport)) {
      logObject.err = details
    } else if (_.isObject(details) && details.err) {
      logObject.err = details.err
      details.err = undefined
      logObject.details = details
    } else if (_.isObject(details)) {
      logObject.details = details
    } else if (details) {
      logObject.details = {details: details}
    }

    if (options && !_.isObject(options)) {
      console.log('DETECTED INVALID OPTIONS:', arguments)
      throw new Error("Options must be an object")
    }

    if (options && _.isObject(options)) {
      lobObject = _.merge(logObject,options)
    }

    if (config.debug || level == 'error') {
      logObject.src = getCaller3Info()
    }

    if (_.size(logObject) > 0)
      log[level](logObject, msg)
    else
      log[level](msg)

    if (_context.goalInstance) {
      var logLine = _.cloneDeep(logObject)
      logLine.timestamp = m.timestamp('iso')
      logLine.msg = msg
      _context.goalInstance.history.push(logLine)
    }

    return deferredStreamProcessing.promise
  }

  m.context = function(contextInfo) {
    var ctx = Context(_context).createChild(contextInfo)
    var childLog = log
    if (contextInfo.module) {
      childLog = log.child({module:contextInfo.module.name})
    }
    var newLogger = module.exports(config, {
      context: ctx,
      log: childLog,
      logStreamCompletionPromises: deps.logStreamCompletionPromises
    })
    newLogger.parent = m
    return newLogger
  };

  m.module = function(moduleName, params) {
    return m.context({module: {
      name: moduleName,
      params: params
    }})
  };

  m.debug = post.bind(m, 'debug')
  m.info = post.bind(m,'info')
  m.fatal = post.bind(m, 'fatal')
  m.error = post.bind(m, 'error')
  m.warn = post.bind(m, 'warn')
  m.log = post.bind('m', 'info')

  m.errorReport = function(msg, details, err) {
    details = details || {}
    return new ErrorReport(err || details.err, msg, details)
  };

  function createGoal(goalName, params, opts) {
    m.log('Starting '+goalName, {params: params, options: opts})

    var newGoalInstance = new Goal(goalName, params)

    var newGoal = m.context({
      goalInstance: newGoalInstance
    })

    if (_context.goalInstance) {
      _context.goalInstance.childGoals = _context.goalInstance.childGoals || []
      _context.goalInstance.childGoals.push(newGoalInstance)
    }

    return newGoal
  }

  m.method = createGoal.bind(m)
  m.goal = createGoal.bind(m)

  m.failSuppressed = function (error) {
    var result = {err: error};
    if (_context.goalInstance) {
      result.goalReport = _context.goalInstance.report("failed")
      return m.error('FAILED_'+result.goalReport.codeName, result)
    }

    return m.error('FAILURE', result)
  };

  m.fail = function(err) {
    m.failSuppressed(err)
    if (_context.goalInstance) {
      var goalReport = _context.goalInstance.report("failed")
      _context.goalReport = goalReport
      throw m.errorReport('FAILED_'+goalReport.codeName, _context, err)
    }
    throw m.errorReport('FAILED', _context, err)
  }

  m.rejectWithCode = function(code) {
    return function(err) {
      m.failSuppressed(err)

      if (_context.goalInstance) {
        var goalReport = _context.goalInstance.report("failed")
        _context.goalReport = goalReport
        throw m.errorReport(code, _context, err)
      }
      throw m.errorReport(code, _context, err)
    }
  }

  m.result = function(result) {
    if (_context && _context.goalInstance) {
      var context = _.cloneDeep(_context)
      var goalReport = _context.goalInstance.report('succeeded', true)
      context.goalReport = goalReport
      delete context.goalInstance
      m.log('Finished '+goalReport.goalName, context)
    } else {
      m.log('Finished.', _context)
    }
    return result
  }

  m.processEventHandlers = function(eventLabel, details, options) {
    var event = {
      eventName: eventLabel,
      handled: false
    };

    //console.log('processing event:', eventLabel)
    if (_context.observers[eventLabel]) {
      //console.log('handling event:', eventLabel)
      return p.map(_context.observers[eventLabel], function(cb) {
        if (!event.handled) return cb(event, details);
      }, {concurrency: 1})
    } else if (m.parent) {
      return m.parent.processEventHandlers(eventLabel, details, options)
    }
    return p.resolve()
  }

  m.addEventHandler = function(eventLabel, handler) {
    _context.observers[eventLabel] = _context.observers[eventLabel] || [];
    _context.observers[eventLabel].push(handler);
  }

  m.timestamp = function (kind) {
    if (config.timestampFunc) return config.timestampFunc()
    if (!kind || kind == 'iso') return new Date().toISOString()
    if (kind=='epoch') return Math.floor(new Date().getTime()/1000)
    if (kind=='epochmill') return new Date().getTime()
  }

  return m
}

function ErrorReport(err, errorCode, details) {
  var that = this

  //this.message = errorCode;
  this.stack = Error().stack;

  this.what = errorCode;
  if (err && err.details && _.isObject(err.details))
    this.details = err.details

  if (_.isObject(details)) {
    this.details = _.merge(this.details || {},details || {})
  }

  this.history = []

  if ((err instanceof Error) && !(err instanceof ErrorReport)) {
    this.rootCause = err.message || err.toString()
    this.err = err
  } else if (err) {
    this.rootCause = err.what
  } else {
    this.rootCause = errorCode
  }

  if (err instanceof ErrorReport) {
    this.rootCause = err.rootCause
    this.details = _.merge(this.details, err.details)
    if (err.history && err.history.length > 0) {
      _.each(err.history, function(val) {
        delete val.history
        delete val.stack

        that.history.push(_.cloneDeep(val))
      })
    }
    delete err.history
    delete err.stack
    this.history.push(_.cloneDeep(err))
  }

  // enable root errors to bubble up to the top level error
  if (err && err.err) this.err = err.err
}

ErrorReport.prototype = Object.create(Error.prototype)
ErrorReport.prototype.name = "ErrorReport";

function Context(ctx) {
  return {
    createChild: function(childCtx) {
      // ctx.children = ctx.children || []
      // ctx.children.push(childCtx)
      //childCtx.parent = ctx
      return childCtx
    }
  }
}

function getCaller3Info() {
    if (this === undefined) {
      console.log('Cannot access caller info in strict mode.')
      // Cannot access caller info in 'strict' mode.
      return;
    }
    var obj = {};
    var saveLimit = Error.stackTraceLimit;
    var savePrepare = Error.prepareStackTrace;
    Error.stackTraceLimit = 3;
    Error.captureStackTrace(this, getCaller3Info);

    Error.prepareStackTrace = function (_, stack) {
        var caller = stack[1];
        if (sourceMapSupport) {
            caller = sourceMapSupport.wrapCallSite(caller);
        }
        obj.file = caller.getFileName();
        obj.line = caller.getLineNumber();
        var func = caller.getFunctionName();
        if (func)
            obj.func = func;
    };
    this.stack;
    Error.stackTraceLimit = saveLimit;
    Error.prepareStackTrace = savePrepare;
    return obj;
}

function Goal(name, goalDetails) {
  this.goalContext = goalDetails || {};
  this.goalId = this.goalContext.goalId

  if (!this.goalContext.goalId) {
    this.goalId = _.uniqueId(new Date().getTime())
  }

  this.name = name;
  this.creationTimeMS = new Date().getTime();
  this.history = [];
}


 String.prototype.toUnderscore = function(){
 	return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
 };

Goal.prototype.report = function (status, topLevelReport) {
  var result = {
    goalId: this.goalId,
    goalName: this.name,
    codeName: this.name.replace('()','').toUnderscore().toUpperCase(),
    context: this.goalContext,
    duration: new Date().getTime() - this.creationTimeMS,
    status: status
  };

  if (!topLevelReport) {
    result.history = this.history
  }

  //if success, show a merged object and show a reduce history
  if (status == "succeeded") {
    result.childGoalReports = []
    _.each(this.childGoals, function(childGoal) {
      result.childGoalReports.push(childGoal.report(status, true))
    })
  }

  return result;
};
