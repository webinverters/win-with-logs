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
      count: 5,
      path: config.errorFile
    });
  }

  if (config.logFile) {
    bunyanConf.streams.push({
      level: config.debug ? 'debug' : 'info',
      type: 'rotating-file',
      period: '1d',
      count: 3,
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
    var log = function log(what, details) {
      var logObject = parseLogObject.apply(undefined,arguments);
      enactObservers.apply(logger, arguments);
      if (details)
        logger.info(logObject, logObject.msg)
      else
        logger.info(what)
    };
    log.log = log;

    log.watchFor = function(eventLabel, observerAction) {
      logger.observers[eventLabel] = logger.observers[eventLabel] || [];
      logger.observers[eventLabel].push(observerAction);
    };
    log.subscribe = log.watchFor;

    log.error = function(msg, err) {
      if (_.isObject(err)) {
        logger.error({err: err}, msg);
      }
      else {
        logger.error(msg, err)
      }
    };

    log.warn = function() {
      var logObject = parseLogObject.apply(undefined,arguments);
      logger.warn(logObject, logObject.msg);
    };

    log.debug = function(msg, details) {
      if (!details) logger.debug(msg)
      else {
        logger.debug(details, msg);
      }
    };

    log.info = function() {
      var logObject = parseLogObject.apply(undefined,arguments);
      logger.info(logObject, logObject.msg);
    };

    log.fatal = function() {
      var logObject = parseLogObject.apply(undefined,arguments);
      logger.fatal(logObject, logObject.msg);
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
      logger.debug({
        msg: 'Initializing Module: '+ moduleName,
        params: JSON.stringify(params, null, '\t')
      }, 'Creating module instance: '+ moduleName);
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
        if (!err) throw 'reject with code called with empty err param.'
        var error = {
          what: code,
          context: context,
          details: err.details,
          err: err,
        };

        error.rootCause = err.rootCause || err.what || _.clone(error);

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
      details = details || {}
      if (err) {
        details = _.merge({}, err.details || {},details)
      }
      var errorReport = {what: what, details:details, err: err, context:context};

      log.error(what, errorReport);
      return errorReport;
    };

    return _.extend(log, robustClient);
  }

  return createEventLogger(log);
};
