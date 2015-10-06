/**
 * @module log
 * @summary: Provides comprehensive logging facilities.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-27.
 * @license Apache-2.0
 */
'use strict';
var _ = require('lodash');

module.exports = function construct(config, logProvider, bunyan, PrettyStream, TrackedStream, robustClient) {
  config = config || {};
  config = _.defaults(config, {
    LOG_RENTENTION_DAYS: 1
  });

  var bunyanConf = {
    src: config.debug,
    name: config.name,
    streams: config.streams
  };

  if (config.enableTrackedEvents) {
    bunyanConf.streams.push({
      level: 'info',
      type: 'raw',
      stream: TrackedStream(config)
    });
  }

  if (config.errorFile) {
    bunyanConf.streams.push({
      level: 'error',
      type: 'rotating-file',
      period: '1d',
      count: config.LOG_RETENTION_DAYS,
      path: config.errorFile
    });
  }

  if (config.logFile) {
    bunyanConf.streams.push({
      level: config.debug ? 'debug' : 'info',
      type: 'rotating-file',
      period: '1d',
      count: config.LOG_RETENTION_DAYS,
      path: config.logFile
    });
  }

  if (PrettyStream) {
    var prettyStdOut = new PrettyStream();
    prettyStdOut.pipe(process.stdout);
    if (config.debug) {
      bunyanConf.streams.push(
        {
          level: 'debug',
          type: 'raw',
          stream: prettyStdOut
        });
      console.warn('Debug Logging Is Enabled.  This is OK if it is not production');
    } else {
      bunyanConf.streams.push({
        level: 'info',
        stream: prettyStdOut           // log INFO and above to stdout
      });
    }
  }

  if (config.slackConfig) {
    var BunyanSlack = require('bunyan-slack');
    bunyanConf.streams.push(new BunyanSlack(config.slackConfig, function (error) {
      console.log('Logging to slack:',error);
    }));
  }

  var log = (logProvider && logProvider(bunyanConf)) || bunyan.createLogger(bunyanConf);
  log.on('error', function (err, stream) {
    console.error('Log Stream Error:', err, stream);
  });

  if (config.env) {
    log = log.child({env: config.env, app: config.app});
  }

  /**
   * Often you may be using external log rotation utilities like logrotate on Linux
   * or logadm on SmartOS/Illumos. In those cases, unless your are ensuring "copy and truncate"
   * sematics (via copytruncate with logrotate or -c with logadm) then the fd for your
   * 'file' stream will change. You can tell bunyan to reopen the file stream with code
   * like this in your app:
   */
  process.on('SIGUSR2', function () {
    log.reopenFileStreams();
  });

  function createEventLogger(logger, context) {
    logger.observers = logger.observers || {};

    var enactObservers = function() {
      if (logger.observers[arguments[0]]) {
        var event = {};
        p.map(logger.observers[arguments[0]] || [], function(cb) {
          if (!event.stopPropagation) cb(event, arguments[1]);
        }, {concurrency: 1});
      }
    };

    function parseLogObject() {
      var logObject = {};

      if (_.isString(arguments[0])) {
        logObject.msg = arguments[0]
      } else if (_.isObject(arguments[0])) {
        logObject.details = arguments[0]
        if (logObject.details.err) {
          logObject.err = logObject.details.err
        }
      }

      if (_.isObject(arguments[1])) {
        logObject.details = arguments[1]
        if (logObject.details.err) {
          logObject.err = logObject.details.err
        }
      }

      return logObject;
    }

    // The log method itself is a little special.  It does 2 things:
    // 1. Calls bunyan info() log level logger.
    // 2. Checks for observers to this log event and fires their handlers.
    var log = function log(what, details, options) {
      // HACK: support util.format style logging (as bunyan does)
      if (arguments.length > 3 || _.isString(details)) {
        logger.info.apply(logger, arguments)
        return
      }

      enactObservers.apply(logger, arguments);
      if (options && _.isObject(options)) {
        options.details = details
        logger.info(options, what)
      }
      else if (details)
        logger.info({details:details}, what)
      else
        logger.info(what)
    };
    log.log = log;

    log.watchFor = function(eventLabel, observerAction) {
      logger.observers[eventLabel] = logger.observers[eventLabel] || [];
      logger.observers[eventLabel].push(observerAction);
    }
    log.subscribe = log.watchFor;

    // TODO: implmeent options param support...
    log.error = function(msg, err, options) {
      if (err) {
        if (err instanceof Error) {
          logger.error({err: err}, msg);
        }
        else if (!err.err) {
          logger.error({details:err}, msg)
        }
        else {
          logger.error({ details: err, err: err.err }, msg)
        }
      }
      else {
        logger.error(msg)
      }
    }

    log.warn = function(msg, details) {
      if (_.isObject(details)) {
        logger.warn(msg, details);
      }
      else if (!details) {
        logger.warn(msg)
      } else {
        logger.warn(msg, {details: details})
      }
    };

    log.debug = function(msg, details) {
      if (_.isObject(details)) {
        logger.debug(msg, details);
      }
      else if (!details) {
        logger.debug(msg)
      } else {
        logger.debug(msg, {details: details})
      }
    };

    log.info = function(msg, details) {
      if (_.isObject(details)) {
        logger.info(msg, details);
      }
      else if (!details) {
        logger.info(msg)
      } else {
        logger.info(msg, {details: details})
      }
    };

    log.fatal = function(msg, details) {
      if (_.isObject(details)) {
        logger.fatal(msg, details);
      }
      else if (!details) {
        logger.fatal(msg)
      } else {
        logger.fatal(msg, {details: details})
      }
    };

    log.failedGoal = function(goal) {
      var logObject = parseLogObject.apply(log,arguments);

      if (!logObject.goalName || !logObject.goalId) {
        console.log('Failed to log goal.  Missing goalName or goalId', logObject)
        log.error('Failed to log goal.  Missing goalName or goalId', logObject)
        return;
      }

      logObject.logAction = {
        failedGoal: {
          goalName: goal.goalName,
          goalId: goal.goalId
        }
      };

      logger.error(logObject, 'Goal Failed: '+goal.goalName+':'+goal.goalId );
    };

    // log a goal completion.
    log.completedGoal = function(goal) {
      var logObject = parseLogObject.apply(log,arguments);

      if (logObject.uid) {
        console.log('Error goal uid is deprecated', logObject)
        log.warn('Error goal uid is deprecated.', logObject)
      }

      if (!logObject.goalName || !logObject.goalId) {
        console.log('Failed to log goal.  Missing goalName or goalId', logObject)
        log.error('Failed to log goal.  Missing goalName or goalId', logObject)
        return;
      }

      logObject.logAction = {
        completeGoal: {
          goalName: goal.goalName,
          goalId: goal.goalId
        }
      };

      logger.info(logObject, 'Completed goal: '+goal.goalName+':'+goal.goalId );
    };

    log.child = logger.child.bind(logger);
    // bonus

    log.context = function(funcName, params, object) {
      logger.debug({
        msg: 'Calling function: '+funcName,
        args: JSON.stringify(params, null, '\t'),
        className: (object && _.isString(object.constructor)) ? object.constructor : 'none'
      }, funcName);
      return createEventLogger(log, {
        where: (object && _.isString(object.constructor)) ? object.constructor + '->' +funcName: funcName,
        args: JSON.stringify(params, null, '\t')
      })
    }

    log.module = function(moduleName, params) {
      logger.info('Initializing Module.', {moduleName:moduleName, params: params})
      return createEventLogger(log, {
        module: {
          moduleName: moduleName,
          params: params
        }
      })
    };

    log.method = log.context;
    log.function = log.context;

    log.rejectWithCode = function(code) {
      return function rejectWithCodeHandler(err) {
        var error = {
          what: code,
          context: context,
          details: err.details,
          err: err,
        };

        if (err)
          error.rootCause = err.rootCause || (err.what ? err : _.clone(error));

        log.error(code, error)
        throw error
      };
    };

    // TODO: delete resolve
    log.resolve = function(result) {
      if (context)
        log(context.where+' resolved.', {context: context, result: result})
      return result;
    };

    log.result = function(result) {
      if (context)
        log(context.where+' resolved.', {context: context, result: result})
      return result;
    };

    log.errorReport = function(what, details, err) {
      var thisErr = new Error(what)
      thisErr.details = details || {}
      if (err) {
        details = _.merge({}, err.details || {},details)
      }
      var errorReport = _.merge(thisErr,{what: what, details:details, err: err, context:context});

      log.error(what, errorReport);
      return errorReport;
    };

    log.timestamp = function (kind) {
      if (config.timestampFunc) return config.timestampFunc()
      if (!kind) return new Date().toISOString()
      if (kind=='epoch') return Math.floor(new Date().getTime()/1000)
      if (kind=='epochmill') return new Date().getTime()
    }

    log.goal = function(goalName, params, options) {
      logger.info('Goal Started: ', {goalName:goalName,params: params})
      var goalInfo = {}
      goalInfo[goalName] = {
        goalName: goalName,
        goalParams: params,
        goalOptions: options
      }

      return createEventLogger(log, _.extend({}, context||{}, {
        goalName: goalName,
        goalParams: params,
        goalOptions: options
      }, goalInfo))
    }

    log.fail = function(err) {
      log.error(context.goalName+'Failed', err)
      throw err
    }

    log.complete = function(result) {
      log.log('Finished '+context.goalName, {result:result}) // TODO: show elapsed time...
      return result
    }

    return _.extend(log, robustClient);
  }

  return createEventLogger(log);
};
