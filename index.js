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
    config = _.defaults(config || {}, {
      env: 'dev',
      silent: false, // if true, disables console logging
      debug: false,
      logStream: 'stdout',
      logStreams: [],
      streams: []  // advanced: custom streams can be subscribed for plugin support.
    });

    debug('Initializing robust-logs', config)
    // alias config.component -> config.name
    config.component = config.component || config.name || ''
    if (!config.component) throw new Error('robust-logs: missing config.name')
    if (!config.app) throw new Error('robust-logs: missing config.app')

    var log = require('./src/win-with-logs')(config, require('axios'))

    debug('logging initialized.')
    return log;
  };
