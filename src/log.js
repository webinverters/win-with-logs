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
    streams: config.streams,
    serializers: {
      err: bunyan.stdSerializers.err
    }
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


function createEventLogger(logger) {
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

  var log = function() {
    enactObservers.apply(logger, arguments);
    logger.info.apply(logger, arguments);
  };

  log.log = function() {
    enactObservers.apply(logger, arguments);
    logger.info.apply(logger, arguments);
  };

  log.watchFor = function(eventLabel, observerAction) {
    logger.observers[eventLabel] = logger.observers[eventLabel] || [];
    logger.observers[eventLabel].push(observerAction);
  };

  // make sure all the interfaces are wired up.
  log.logWarn = logger.warn;
  log.logError = logger.error;
  log.logFatal = logger.fatal;
  log.debug = logger.debug;
  log.error = logger.error;
  log.error = function() {
    logger.error.apply(logger, arguments);
  };
  log.warn = function() {
    logger.warn.apply(logger, arguments);
  };
  log.debug = function() {
    logger.debug.apply(logger, arguments);
  };
  log.logError = function() {
    logger.error.apply(logger, arguments);
  };
  log.info = function() {
    logger.log.apply(logger, arguments);
  };
  log.fatal = logger.fatal;

  log.child = function() {
    logger.child.apply(logger, arguments);
  };

  return log;
}