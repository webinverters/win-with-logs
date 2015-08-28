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

module.exports = function construct(config, logProvider, bunyan, PrettyStream, TrackedStream) {
  config = config || {};
  //config = _.defaults(config, );

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
      count: 14,
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

  if (config.slackLoggingEnabled) {
    var BunyanSlack = require('bunyan-slack');
    bunyanConf.stream = new BunyanSlack(config.slackConfig, function (error) {
      console.log(error);
    });
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

  return createEventLogger(log);
};


function createEventLogger(logger, context) {
  logger.observers = {};

  var enactObservers = function() {
    if (arguments[0][0] == '@') {
      if (logger.observers[arguments[0]]) {
        var event = {};
        p.map(logger.observers[arguments[0]] || [], function(cb) {
          if (!event.stopPropagation) cb(event, arguments[1]);
        }, {concurrency: 1});
      }
    }
  };

  function parseLogObject() {
    var logObject = {};

    if (_.isString(arguments[0])) {
      logObject.msg = arguments[0];
      if (_.isObject(arguments[1])) {
        _.extend(logObject, arguments[1]);
      }
      _.each(arguments, function(arg, idx) {
        if (idx != 0) {
          logObject.msg += ' ' + JSON.stringify(arg);
        }
      });
    } else if (!arguments[1]) {
      if (_.isObject(arguments[0])) return arguments[0];
    } else {
      _.each(arguments, function(arg, idx) {
        logObject.msg += ' ' + JSON.stringify(arg);
      });
    }
    return logObject;
  }

  // The log method itself is a little special.  It does 2 things:
  // 1. Calls bunyan info() log level logger.
  // 2. Checks for observers to this log event and fires their handlers.
  var log = function log() {
    var logObject = parseLogObject.apply(undefined,arguments);
    enactObservers.apply(logger, arguments);
    logger.info(logObject, logObject.msg);
  };

  log.watchFor = function(eventLabel, observerAction) {
    logger.observers[eventLabel] = logger.observers[eventLabel] || [];
    logger.observers[eventLabel].push(observerAction);
  };

  // make sure all the interfaces are wired up.
  log.error = function() {
    if (_.isString(arguments[0]) && _.isObject(arguments[1]) && arguments[1].message) {
      logger.error({err: arguments[1]}, arguments[0]);
    } else {
      var logObject = parseLogObject.apply(undefined,arguments);
      logger.error(logObject, logObject.msg);
    }
  };
  log.warn = function() {
    var logObject = parseLogObject.apply(undefined,arguments);
    logger.warn(logObject, logObject.msg);
  };
  log.debug = function() {
    var logObject = parseLogObject.apply(undefined,arguments);
    logger.debug(logObject, logObject.msg);
  };
  log.info = function() {
    var logObject = parseLogObject.apply(undefined,arguments);
    logger.info(logObject, logObject.msg);
  };

  log.fatal = function() {
    var logObject = parseLogObject.apply(undefined,arguments);
    logger.fatal(logObject, logObject.msg);
  };

  // log a goal completion.
  log.completion = function() {
    var logObject = parseLogObject.apply(undefined,arguments);
    if (!logObject.uid) { log.warn('Goal completion log failed due to no uid specified.'); }

    logObject.completeGoal = logObject.uid;
    logger.info(logObject, logObject.msg);
  };

  log.child = function() {
    var logObject = parseLogObject.apply(undefined,arguments);
    logger.child(logObject);
  };


  // assign aliases:
  log.logFatal = log.fatal;
  log.log = log;
  log.logError = log.error;
  log.logWarn = log.warn;

  // bonus

  log.context = function(funcName, params, object) {
    log.debug(funcName+"()", {
      params: JSON.stringify(params),
      objectName: object? object.constructor : 'none'
    });
    return createEventLogger(log, {
      where: object? object.constructor + '->' +funcName: funcName,
      params: params
    })
  }

  log.rejectWithCode = function(code) {
    return function rejectWithCodeHandler(err) {
      var details = {
        what: code,
        context: context,
        details: err.details,
        err: err,
        why: _.isString(err) ? err : err.message
      };
      log.error(code, details)
      return p.reject(details)
    };
  }

  log.resolve = function(result) {
    if (context)
      log.log(context.what+' resolved.', {context: context, result: result});
    return result;
  }

  log.errorReport = function(what, details) {
    if (context) {
      details = _.extend({}, context, details, {what: what})
    }
    log.error(what, details);
    return details;
  }

  return log;
}