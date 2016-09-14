/**
 * @module logger
 * @summary: Provides a logger instance.
 *
 * @description:
 *
 * Author: m0ser
 * Created On: 2015-10-28.
 * @license Apache-2.0
 */

 var _ = require('lodash'),
   p = require('bluebird'),
   Promise = p

var _plugins, _observers = {}
module.exports = function(config, deps) {
  var m = post.bind(null,'info'), 
		_context = deps.context || {},
    log = deps.log,
		_ringBuff = deps.ringBuff,
		_plugins = deps.plugins || _plugins

	// TODO: figure why this is here.
  _context = _.defaults(_context, {
    observers: {},
    chain: config.module || ''
  })

  m.context = function(contextInfo) {
		if (config.debug && !config.silent) console.log('Logger: Creating context...', contextInfo)
		if (contextInfo.opts) {
			if (contextInfo.opts.isModule) {
				// must clone the config to avoid isModule flag from permeating.  
				// Not sure a better way to handle this.  isModule is set by libraries
				// when they are created with a logger instance.
				config = _.cloneDeep(config)
				config.isModule = true
			}
		}
		
    contextInfo.chain = _context.chain
    if (contextInfo.module) {
      contextInfo.chain = contextInfo.module.name
    } else {
      contextInfo.chain += '.'+contextInfo.name
    }

    var newLogger = module.exports(config, {
         log: log.child({chain: contextInfo.chain}),
         logStreamCompletionPromises: deps.logStreamCompletionPromises,
         context: _.extend(new Context(_context), contextInfo),
				 ringBuff: deps.ringBuff
       })

    newLogger.parent = m
    return newLogger
  }

  m.module = function(moduleName, args, opts) {
    return m.context({module: {
      name: moduleName,
      args: args,
			opts: opts
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
  
  // difference between method and goal: a method can fail and be recovered from.  
  // a goal is something that is not recovered from and should never fail.  You 
  // always want to be alerted if a goal fails, because if a goal fails, your 
  // application is not doing its job.
  m.method = createGoal.bind(m, 'method')
  m.goal = createGoal.bind(m, 'goal')
  
	// TODO: coming soon...  The ability to query the log.
  m.query = function() { throw new Error('log.query() unsupported')}
	//	m.query = _plugins['loggly'] ? _plugins['loggly'].query : function() {
	//    throw new Error('log.query() not available.  Load a plugin that supports it.')
	//  }

  function createGoal(type, goalName, params, opts) {
    opts = opts || {}
    opts.type = type 
    var newGoalInstance = new Goal(goalName, params, opts)
    m.log('Starting '+goalName, {params: params}, {custom: {goalId: newGoalInstance.goalId}})
    var newGoal = m.context({
      goalInstance: newGoalInstance,
      name: goalName
    })

    return newGoal
  }

	m.report = function(err, prev, details) {
		if (!(err instanceof Error)) throw new Error('ASSERT:report:InvalidParam "err"')
		if (prev && !(prev instanceof Error)) {
			if (!_.isObject(prev)) prev = {details: prev}
			if (details) {
				details = _.merge({}, prev, details)
			}
		}
		
		var errorDetails = err.message.split(':')
		if (errorDetails.length == 3) {
			err.category = errorDetails[0]
			err.activity = errorDetails[1]
			err.what = errorDetails[2]
		}
		
		if (prev && (prev instanceof Error)) {
			var errorDetails = prev.message.split(':')
			if (errorDetails.length == 3) {
				prev.category = errorDetails[0]
				prev.activity = errorDetails[1]
				prev.what = errorDetails[2]
			}
			err.prev = prev
			err.root = prev.root || prev
			err.rootCause = prev.rootCause || prev.message
		} else {
			err.root = err
		}
		
		var custom = _.isObject(details) ? details : {}
		err.code = err.message + ':' + Date.now()
		custom.code = err.code
		err.what = err.what || custom.what
		
		if (err.root) {
			if (err.category == 'USER') m.warn(err.message, err, {custom: custom})
			else m.error(err.message, err, {custom: custom})
		}
		
		return err
	}

  m.failSuppressed = function (error) {
		m.report(error)
    var result = {err: error}

    if (_context && _context.goalInstance) {
      var goalReport = result.goalReport = _context.goalInstance.report("FAILED")
      m.error('Failed '+goalReport.goalName+'.', {
        goalId: goalReport.goalId,
        name: goalReport.goalName,
        codeName: goalReport.codeName,
				err: error
      }, {tags: 'GOAL-COMPLETE,GOAL-FAILED', custom: {goalReport: goalReport, goalDuration: goalReport.duration}})
    }
		
		return error
  }

  m.fail = function(err) {
    throw m.failSuppressed(err)
  }

  m.rejectWithCode = function(code) {
    return function(err) {
      throw m.report(err, null, {what: code})
    }
  }

  m.pass = m.result = function(result) {
    if (_context && _context.goalInstance) {
      var goalReport = _context.goalInstance.report('SUCCEEDED', result)
      m.log('Finished '+goalReport.goalName+'.', {
        goalId: goalReport.goalId,
        name: goalReport.goalName,
        goalName: goalReport.codeName
      }, {
        tags: 'GOAL-COMPLETE', 
        custom: {goalReport: goalReport, goalDuration: goalReport.duration}, 
        priority: _context.goalInstance.priority || 1
      })
    } else {
      m.log('Result: ', _context)
    }

    return result
  }

  /**
   * Checks for any event handlers that match this event label and runs them
   * all.
   *
   * @param  {string} eventLabel The label for the event.
   * @param  {type} details    description
   * @param  {type} options    description
   * @return {type}            description
   */
  m.processEventHandlers = function(eventLabel, details, options) {
    var event = {
      eventName: eventLabel,
      handled: false
    }

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
    _context.observers[eventLabel] = _context.observers[eventLabel] || []
    _context.observers[eventLabel].push(handler)

    _observers[eventLabel] = _observers[eventLabel] || []
    _observers[eventLabel].push(handler)
		
		return function() {
			m.removeEventHandler(eventLabel, handler)
		}
  }

  m.removeEventHandler = function(eventLabel, handler) {
    //console.log(_observers[eventLabel].length, _context.observers[eventLabel].length)

    if (_observers[eventLabel]) {
      _.pull(_observers[eventLabel], handler)
    }
    if (_context.observers[eventLabel]) {
      _.pull(_context.observers[eventLabel], handler)
    }

    //console.log('Removed event handlers', _observers[eventLabel].length, 		_context.observers[eventLabel].length)
  }

  m.timestamp = function (kind) {
		if (!kind) return Date.now()
    else if (kind=='epoch') return Date.now()/1000
    else if (kind=='epochmill') return Date.now()
		else if (kind=='iso') return new Date().toISOString()
		throw new Error('log.timestamp(kind) says "kind" is invalid.')
  }

	// create aliases
  m.on = m.addEventHandler
	m.errorReport = m.report
	
	function flushLogBuffer() {
		var count = _ringBuff.length
		if (count == 0) return
    while(count--) {
			var args = _ringBuff.shift()
			args[3] = args[3] || {}
			args[3].priority = 11
			post.apply(m, args)
    }
  }

  function post(level, msg, details, options) {
    if (config.silent) return p.resolve()
    
    options = options || {}
    if (!_.isObject(options)) {
      details.options = options
      options = {}
    }

    if (!log[level]) {
      log.error({msg:'Invalid log level',
								 arg: level, 
								 err: new Error('Invalid log level.')})
      level = 'info'
    }
		
		if (!config.debug && config.ringBufferSize && (!options.priority || options.priority < 10)) {
			if (level == 'warn') {} // continue logging as normal.
			else if (level == 'error' || level == 'fatal') flushLogBuffer()
			else {
				// preserve the original time that the event was logged.
				options.time = new Date()
				
				_ringBuff.enqueue([level,msg,details,options])
				return p.resolve(false)
			}
		}
    
    // hide goal complete messages if not in debug mode and ringBuffer is enabled.
    if (config.plugins && config.ringBufferSize && options.priority && options.priority>=10) {
      if (level != 'error' && level != 'fatal' && level != 'warn') level = 'debug'
    }
		
		// make library logs always trace.  priority < 11 allows ringbuffer output 
		// to retain its original level output since the dump should contain 
		// trace level details anyways.
		if (config.isModule && (!options.priority || options.priority < 11)) {
			if (level != 'error' && level != 'fatal') level = 'trace'
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

    if (details instanceof Error) {
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
		if (options.timestamp) logObject.timestamp = options.timestamp
		if (options.time) logObject.time = options.time
    if (_.isObject(options.custom)) {
      logObject = _.merge(logObject,options.custom)
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
				console.log(ex)
        console.log('Logger: exception occurred.  Attempting again using safe stringify...')
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
	
  return m
}

function Context(ctx) {
  this.__parentContext = ctx
}

function Goal(name, goalDetails, opts) {
  opts = opts || {}
  this.goalContext = goalDetails || {};
  this.goalId = this.goalContext.goalId
  this.type = opts.type
  
  // TODO: if this is in the context of another goal, set the parentGoalId to track subgoals.

  if (!this.goalContext.goalId) {
    this.goalId = _.uniqueId()
  }

  this.name = name;
  this.creationTimeMS = Date.now()
  this.tags = opts.tags
  this.priority = opts.priority || 1
}

String.prototype.toUnderscore = function(){
	return this.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
}

Goal.prototype.report = function (status, result) {
  var report = {
    goalId: this.goalId,
    goalName: this.name,
    codeName: this.name.replace('()','').toUnderscore().toUpperCase(),
    context: this.goalContext,
    duration: Date.now() - this.creationTimeMS,
    result: result,
    type: this.type,
    status: status
  }
  return report
}



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