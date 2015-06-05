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
  config = _.defaults(config, {
    name: 'DefaultLog',
    errorFile: '',
    logFile: '',
    debug: false,
    app: 'DefaultApp',
    component: 'DefaultComponent',
    slackLoggingEnabled: false,
    slackConfig: {
      webhook_url: "",
      channel: "",
      username: "bot"
    },
    enableTrackedEvents: true,
    streamName: 'Sewer',  // for tracked events, this will the be the kinesis stream name.
    streams: []
  });

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
    log = log.child({env: config.env, component: config.component, app: config.app});
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

  log.log = log.info;
  log.logWarn = log.warn;
  log.logError = log.error;
  log.logFatal = log.fatal;

  return log;
};