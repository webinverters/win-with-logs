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


var _ = require('lodash'),
	p = require('bluebird'),
	debug = require('debug')('robust-logs')
	

module.exports = function construct(config) {
	if (config && config.logging) config = config.logging

	config = config || {}
	config = _.defaults(config, {
		app: 'n/a',
		component: 'n/a',
		silent: true, // disable if you want extra trace logging from this library.
		env: 'n/a',
		debug: false,
		isModule: false,  // enable if you are logging in a library (not an app) to make logs TRACE level so as not to pollute the application logs.
		ringBuffer: false,
		ringBufferSize: 150,
		plugins: null,
		logStreams: [],
		streams: []  // advanced: custom streams can be subscribed for plugin support.
	})
	
	// alias config.component -> config.name
	if (config.name) config.component = config.name
	
	var ringBuffer
	if (config.ringBuffer) ringBuffer = require('fixedqueue').FixedQueue(config.ringBufferSize)

	var log = require('./src/win-with-logs')(config, require('axios'), ringBuffer)

	if (!config.disableSplashScreen) {
		console.log('===== You are winning with robustly.io logs =====')
		console.log(config)
	}
		
	return log
}
