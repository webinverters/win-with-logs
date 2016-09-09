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
	 bunyan = require('bunyan'),
 	 Logger = require('./logger'),
   FinalStream = require('./streams/final-stream'),
	 PluginStream = require('./streams/plugin-stream')

function WinWithLogs() {}
module.exports = function(config) {
  config.isNotBrowser = config.isNotBrowser || (typeof module !== 'undefined' && this.module !== module && typeof window === 'undefined')
  var m = new WinWithLogs(), logStreamCompletionPromises = {},
  	_plugins = {}, ringBuffer = []
  
  if (config.ringBufferSize) ringBuffer = require('fixedqueue').FixedQueue(config.ringBufferSize)
  
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
      streams: config.streams || [],
      serializers: bunyan.stdSerializers
    }
		delete config.streams

    if (config.isNotBrowser) {
      if (config.debug) { 
        bunyanConf.streams.push({
					level: 'trace',
					stream: process.stdout
		    })
      } else {
        bunyanConf.streams.push({
					level: 'info',
					stream: process.stdout
		    })
      }
    } else {
      console.log('Logger: detected browser runtime.')
    }

    if (config.plugins) {
      if (config.plugins.loggly) {
        console.log('Logger: adding the loggly plugin.')
        _plugins['loggly'] = require('./plugins/loggly-plugin')(config, require('axios'))
      }
      
      if (config.plugins.goalTracking) {
        console.log('Logger: goal tracking plugin enabled.')
        _plugins['loggly'] = require('./plugins/goal-tracking')(config)
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
