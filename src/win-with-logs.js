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
 var _ = require('lodash'),
   p = require('bluebird'),
   Promise = p,
   debug = require('debug')('robust-logs'),
	 bunyan = require('bunyan'),
 	 Logger = require('./logger'),
   RotatingFileMaxStream = require('./streams/rotating-file-max'),
   FinalStream = require('./streams/final-stream'),
	 PluginStream = require('./streams/plugin-stream')

 // TODO: come up with something better than this...
var logStreams = {
  "rotating-file-max": RotatingFileMaxStream
}

function WinWithLogs() {}
module.exports = function(config, axios, ringBuffer) {
  config.isNotBrowser = config.isNotBrowser || (typeof module !== 'undefined' && this.module !== module && typeof window === 'undefined')
  var m = new WinWithLogs(), logStreamCompletionPromises = {},
  	_plugins = {}

  /**
   * Initializes the logger based on the configuration
   * provided.
   * @param  {object} config 
   * @return {BunyanLogInstance}
   */
  m.setup = function(config) {
    var bunyanConf = {
      src: config.debug,
      name: config.component,
      streams: config.streams || []
    }
		delete config.streams

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

    if (config.isNotBrowser) {
      if (config.debug) { 
        
      }
      
		  bunyanConf.streams.push({
					level: 'trace',
					stream: process.stdout
		  })
    } else {
      console.log('Logger: detected browser runtime.')
    }

    if (config.plugins) {
      if (config.plugins.loggly) {
        console.log('Logger: adding the loggly plugin.')
        _plugins['loggly'] = require('./plugins/loggly-plugin')(config, axios)
      }

      bunyanConf.streams.push({
        name: 'plugin',
        level: 'trace',
        type: 'raw',
        stream: PluginStream(config, _plugins)
      })
    }
		

		// NOTE: the FinalStream must be pushed last.  
		// It is responsible for resolving promises after all other streams have run.
    bunyanConf.streams.push({
      name: 'final',
      level: 'debug',
      type: 'raw',
      stream: FinalStream(config, logStreamCompletionPromises)
    })

    var log = bunyan.createLogger(bunyanConf)
    log.on('error', function (err, stream) {
      console.error('Logger: Unhandled LogStream Error.', err, stream);
    })

    return log.child({
      _app:config.app,
      _component: config.component,
      _env: config.env
    })
  }

  var log = m.setup(config)

  var logger = Logger(
    config, {
    log: log,
    logStreamCompletionPromises: logStreamCompletionPromises,
    plugins: _plugins,
		ringBuff: ringBuffer
  })

  return logger
}
