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

var winWithLogs = require('./src/api/win-with-logs-api');

var _ = require('lodash');

module.exports = function construct(config) {
  config = config ? config : {};
  config = _.defaults(config, {
    name: 'DefaultComponent',
    app: 'DefaultApp',
    env: 'dev',
    isNode:true,
    debug: config.env != 'prod' ? true : false,
    silent:false
    //useLoggingGlobals: true,
  });

  return new winWithLogs(config);
};
