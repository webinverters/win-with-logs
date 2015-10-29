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

var _ = require('lodash');

module.exports = function construct(config) {
  config = config ? config : {};
  config = _.defaults(config, {
    app: 'DefaultApp',
    component: 'DefaultComponent',
    env: 'dev',
    silent: false, // if true, disables console logging
    debug: false,
    robustKey: '',
    logStream: process.stdout,
    cloudLogServerEndpoint: 'http://robustly.io/api/logs',
    streams: []  // advanced: custom streams can be subscribed for plugin support.
  });

  // alias config.component -> config.name
  config.component = config.component || config.name

  var log = require('./src/win-with-logs')(config);

  log.EventProcessor = require('./src/event-processor');

  var moduleLog = log.module('win-with-logs', {config: config})
  moduleLog.debug('Initialized.')

  return log;
};
