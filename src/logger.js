/**
* @Author: Robustly.io <Auto>
* @Date:   2016-03-24T04:39:49-04:00
* @Email:  m0ser@robustly.io
* @Last modified by:   Auto
* @Last modified time: 2016-05-06T10:41:37-04:00
* @License: Apache-2.0
*/



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

 var _ = require('lodash'),
   p = require('bluebird'),
   Promise = p,
   debug = require('debug')('robust-logs')

var _plugins, _observers = {}
module.exports = function(config, deps) {
  var m = post.bind(null,'info'), _context = deps.context || {},
    log = deps.log

  _context = _.defaults(_context, {
    observers: {},
    chain: config.module || ''
  })

  _plugins = deps.plugins || _plugins

  // bluebird deprecated the defer() method, and I'm not sure how to
  // refactor the code to use the new method so I"ll jsut add my own
  // version of defer() for now.
  function defer() {
    var resolve, reject;
    var promise = new Promise(function() {
      resolve = arguments[0]
      reject = arguments[1]
    });
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    }
  }

  function post(level, msg, details, options) {
    options = options || {}
    if (!_.isObject(options)) {
      details.options = options
      options = {}
    }

    if (!log[level]) {
      log.trace({msg:'Invalid log level',arg: level})
      level = 'info'
    }

    var goal = (_context && _context.goalInstance) || {}
    var logObject = {
        _id: parseInt(_.uniqueId()),
        _tags: goal.tags ? options.tags + ',' + goal.tags : options.tags,
        _goalId: goal.goalId
      },
      streamProcessingResolver = defer()

    deps.logStreamCompletionPromises[logObject._id] = {
      finalDef: streamProcessingResolver,
      eventHandlingCompleted: m.processEventHandlers(msg, details, options),
      promises: []
    }

    if (details instanceof Error && !(details instanceof ErrorReport)) {
      logObject.err = details
    } else if (_.isObject(details) && details.err) {
      logObject.err = details.err
      //details.err = undefined
      logObject.details = details
    } else if (_.isObject(details)) {
      logObject.details = details
    } else if (details) {
      logObject.details = {details: details}
    }

    if (logObject.details) delete logObject.details.err

    if (_.isObject(options.custom)) {
      logObject = _.merge(logObject,options.custom)
      delete logObject.callDepth
    }

    if (config.debug || level == 'error') {
      logObject.src = getCaller3Info(options.callDepth)
    }

    var sourceInfo
    if (options.source) {
      function getErrorObject(){
        try { throw Error('') } catch(err) { return err; }
      }
      var err = getErrorObject();
      var caller_line = err.stack.split("\n")[4];
      var index = caller_line.indexOf("at ");
      var clean = caller_line.slice(index+2, caller_line.length);
      sourceInfo = clean
    }
    if (!config.isNotBrowser && console) {
      if (!console[level]) console[level] = console.log
      if (sourceInfo) console[level]('[%s] %s:', _context.chain, logObject.msg || msg, logObject.details, sourceInfo)
      else console[level]('[%s] %s:', _context.chain, logObject.msg || msg, logObject.details)
      return
    }

    if (_.size(logObject) > 0) {
      try {
        log[level](logObject, msg)
      }
      catch (ex) {
        debug('Logging exception occurred. Attempting to stringify safely...')
        if (ex instanceof TypeError) {
          var stringify = require('json-stringify-safe')
          log[level](JSON.parse(stringify(logObject)), msg)
        }
        else throw ex
      }
    }
    else
      log[level](msg)

    return streamProcessingResolver.promise
  }

  m.context = function(contextInfo) {
    contextInfo.chain = _context.chain

    if (contextInfo.module) {
      contextInfo.chain = contextInfo.module.name
    } else {
      contextInfo.chain += '.'+contextInfo.name
    }

    var newLogger = module.exports(config, {
         log: log.child({chain: contextInfo.chain}),
         logStreamCompletionPromises: deps.logStreamCompletionPromises,
         context: _.extend(new Context(_context), contextInfo)
       })

    newLogger.parent = m
    return newLogger
  }

  m.module = function(moduleName, params) {
    return m.context({module: {
      name: moduleName,
      params: params
    }})
  }

  m.debug = post.bind(m, 'debug')
  m.info = post.bind(m,'info')
  m.fatal = post.bind(m, 'fatal')
  m.error = post.bind(m, 'error')
  m.logError = post.bind(m, 'error')
  m.warn = post.bind(m, 'warn')
  m.log = post.bind(m, 'info')
  m.trace = post.bind(m,'trace')
  m.method = createGoal.bind(m)
  m.goal = createGoal.bind(m)
  m.query = _plugins['loggly'] ? _plugins['loggly'].query : function() {
    throw new Error('log.query() not available.  Load a plugin that supports it.')
  }

  function createGoal(goalName, params, opts) {
    var newGoalInstance = new Goal(goalName, params, opts)
    m.log('Starting '+goalName, {params: params}, {callDepth: 2, custom: {goalId: newGoalInstance.goalId}})
    var newGoal = m.context({
      goalInstance: newGoalInstance,
      name: goalName
    })

    return newGoal
  }

  m.errorReport = function(errorCode, details, err, __callDepth) {
    details = details || {}
    if (!_.isObject(details)) details = { details: details }

    if (!details.err) {
      if (err) details.err = err
      else details.err = err = new Error(errorCode)
    }
    err = details.err

    var goalReport = details.goalReport
    delete details.goalReport // avoid duplicating log report in output.
    if (goalReport) {
      m.error(errorCode, details, {
        callDepth: __callDepth || 2,
        custom: {goalReport: goalReport, goalDuration: goalReport.duration}
      })
    } else {
      m.error(errorCode, details, {callDepth:__callDepth || 2})
    }

    // this logs the error immediately and will likely cause multiple
    // of the same error to apear in the logs since it is usually thrown.
    // But that is OKAY b.c. errors need extra attention anyways.

    err.errorCode = errorCode
    err.what = errorCode

    return err
  }

  m.failSuppressed = function (error, __callDepth) {
    var result = {err: error}

    if (_context && _context.goalInstance) {
      var goalReport = result.goalReport = _context.goalInstance.report("FAILED")
      m.error('GOAL_FAILED', {
        goalId: goalReport.goalId,
        name: goalReport.goalName,
        codeName: goalReport.codeName
      }, {callDepth:2, tags: 'GOAL-COMPLETE', custom: {goalReport: goalReport, goalDuration: goalReport.duration}})
    }

    if (error instanceof ErrorReport) {
      result.message = error.message
    } else if (_.isString(error)) {
      result.message = error
      result.err = new Error(error)
    } else if (error instanceof Error) {
      result.message = error.message
    }

    return m.errorReport(result.goalReport ? 'FAILED_'+result.goalReport.codeName : result.message,
      result, result.err, __callDepth)
  }

  m.fail = function(err) {
    throw m.failSuppressed(err)
  }

  m.rejectWithCode = function(code) {
    return function(err) {
      var err = m.failSuppressed(err)
      throw m.errorReport(code, _context, err)
    }
  }

  m.pass = m.result = function(result) {
    if (_context && _context.goalInstance) {
      var goalReport = _context.goalInstance.report('SUCCEEDED', result)
      m.log('GOAL_SUCCEEDED', {
        goalId: goalReport.goalId,
        name: goalReport.goalName,
        codeName: goalReport.codeName
      }, {callDepth:2, tags: 'GOAL-COMPLETE', custom: {goalReport: goalReport, goalDuration: goalReport.duration}})
    } else {
      m.log('Result: ', _context, {callDepth:2})
    }
    return result
  }

  /**
   * Checks for any event handlers that match this event label and runs them
   * all.
   *
   * @param  {type} eventLabel description
   * @param  {type} details    description
   * @param  {type} options    description
   * @return {type}            description
   */
  m.processEventHandlers = function(eventLabel, details, options) {
    var event = {
      eventName: eventLabel,
      handled: false
    };

    if (_context.observers[eventLabel]) {
      return p.map(_context.observers[eventLabel], function(cb) {
        if (!event.handled) return cb(event, details);
      }, {concurrency: 1})
    } else if (m.parent) {
      return m.parent.processEventHandlers(eventLabel, details, options)
    } else if (_observers[eventLabel]) {
      return p.map(_observers[eventLabel], function(cb) {
        if (!event.handled) return cb(event, details);
      }, {concurrency: 1})
    }
    return p.resolve()
  }

  m.addEventHandler = function(eventLabel, handler) {
    _context.observers[eventLabel] = _context.observers[eventLabel] || [];
    _context.observers[eventLabel].push(handler);
    _observers[eventLabel] = _observers[eventLabel] || []
    _observers[eventLabel].push(handler)
  }

  m.on = m.addEventHandler

  m.timestamp = function (kind) {
    if (config.timestampFunc) return config.timestampFunc()
    if (!kind || kind == 'iso') return new Date().toISOString()
    if (kind=='epoch') return Math.floor(Date.now()/1000)
    if (kind=='epochmill') return Date.now()
  }

  return m
}

function ErrorReport(err, errorCode, details) {
  this.message = errorCode;
  this.code = err.code || errorCode

  this.what = errorCode;
  if (err && err.details && _.isObject(err.details))
    this.details = err.details

  if (_.isObject(details)) {
    this.details = _.merge(this.details || {},details || {})
  }

  this.prevError = err

  if ((err instanceof Error) && !(err instanceof ErrorReport)) {
    this.rootCause = err.message || err.toString()
    this.err = err
  } else if (err) {
    this.rootCause = err.what
  } else {
    this.rootCause = errorCode
  }

  if (err instanceof ErrorReport) {
    this.details = _.merge(this.details, err.details)
    delete this.details.observers
    delete this.details.goalInstance

    if (!err.err) {
      this.rootCause = err.rootCause || err.what
      this.err = err
    } else {
      this.rootCause = err.rootCause
    }
  }

  // enable root errors to bubble up to the top level error
  if (err && err.err) this.err = err.err
}

ErrorReport.prototype = Object.create(Error.prototype)
ErrorReport.prototype.name = "ErrorReport";

function Context(ctx) {
  this.__parentContext = ctx
}

function getCaller3Info(level) {
  level = level || 1
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
        var caller = stack[level];
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

function Goal(name, goalDetails, opts) {
  opts = opts || {}
  this.goalContext = goalDetails || {};
  this.goalId = this.goalContext.goalId

  if (!this.goalContext.goalId) {
    this.goalId = _.uniqueId()
  }

  this.name = name;
  this.creationTimeMS = Date.now()
  this.tags = opts.tags
}


 String.prototype.toUnderscore = function(){
 	return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
 };

Goal.prototype.report = function (status, result) {
  var report = {
    goalId: this.goalId,
    goalName: this.name,
    codeName: this.name.replace('()','').toUnderscore().toUpperCase(),
    context: this.goalContext,
    duration: Date.now() - this.creationTimeMS,
    result: result,
    status: status
  }
  return report
}

// the fed is in a position where all of it's visible actions look good.  And all of it's bad actions are invisible.
