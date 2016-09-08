/**
 * @module index.js
 * @summary: Wires up the library.
 *
 * @description:
 *
 * Author: justin
 * Created On: 2015-03-21.
 * @license Apache-2.0
 */

'use strict';


var _ = require('lodash')
	
module.exports = function construct(config) {
	if (config && config.logging) {
    config.logging.env = config.logging.env || config.env
    config.logging.app = config.logging.app || config.app
    config.logging.component = config.logging.component || config.component
    config = config.logging
  }

	config = config || {}
	config = _.defaults(config, {
		app: 'n/a',
		component: 'n/a',
    env: 'n/a',
		silent: false, // enable if you want to disable all logging.
		debug: false,
		isModule: false,  // enable if you are logging in a library (not an app) to make logs TRACE level so as not to pollute the application logs.
    disableSplashScreen: false,
		ringBufferSize: 0,  
		plugins: null,
		streams: []  // advanced: custom streams can be subscribed for plugin support.
	})
	
	// alias config.component -> config.name
	if (config.name) config.component = config.name

	var log = require('./src/win-with-logs')(config)

	if (!config.disableSplashScreen) {
		console.log('===== You are winning with robustly.io logs =====')
		console.log(config)
	}
		
	return log
}
