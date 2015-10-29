/**
 * @module win-with-logs
 * @summary: Provides logging client support, with a twist.
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-10-28.
 * @license Apache-2.0
 */

var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var Logger = require('./logger')
var RotatingFileMaxStream = require('./streams/rotating-file-max')
var FinalStream = require('./streams/final-stream')
var _ = require('lodash'),
    p = require('bluebird')

var logStreams = {
  "rotating-file-max": RotatingFileMaxStream
}

module.exports = function(config) {
  var m = new WinWithLogs()

  var logStreamCompletionPromises = {}

  /**
   * Initializes the logger based on the configuration
   * provided.
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  m.setup = function(config) {
    var bunyanConf = {
      src: config.debug,
      name: config.component,
      streams: config.streams
    }

    _.each(config.logStreams, function(stream) {
      if (!logStreams[stream.type]) {
        console.log('Log Stream Invalid: ', stream)
        throw new Error('Invalid log stream.')
      }
      bunyanConf.streams.push({
        level: stream.level,
        type: 'raw',
        stream: logStreams[stream.type](stream, logStreamCompletionPromises)
      })
    })

    if (!config.silent) {
      var prettyStdOut = new PrettyStream();
      prettyStdOut.pipe(config.logStream);
      if (config.debug) {
        bunyanConf.streams.push(
          {
            level: 'debug',
            type: 'raw',
            stream: prettyStdOut
          });
        console.warn('Debug Logging Is Enabled.  This is OK if it is not production.');
      } else {
        bunyanConf.streams.push({
          level: 'info',
          stream: prettyStdOut           // log INFO and above to stdout
        });
      }
    }

    bunyanConf.streams.push({
      name: 'final',
      level: 'debug',
      type: 'raw',
      stream: FinalStream(config, logStreamCompletionPromises)
    })

    var log = bunyan.createLogger(bunyanConf)
    log.on('error', function (err, stream) {
      console.error('Log Stream Error:', err, stream);
    });

    return log.child({
      app:config.app,
      part: config.component,
      env: config.env
    })
  }

  var log = m.setup(config)

  var logger = Logger(
    {debug: config.debug}, {
    log: log,
    logStreamCompletionPromises: logStreamCompletionPromises
  })

  return logger
}

function WinWithLogs() {}
