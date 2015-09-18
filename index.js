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

var api=require('./src/api')

module.exports = function construct(config) {
  config = config ? config : {};
  config = _.defaults(config, {
    name: 'DefaultComponent',
    app: 'DefaultApp',
    env: 'dev',
    errorFile: 'error.log',
    logFile: 'trace.log',
    useLoggingGlobals: true,
    debug: config.env != 'prod' ? true : false,
    //slackConfig: {
    //  webhook_url: "",
    //  channel: "",
    //  username: "bot"
    //},
    robustKey: '',
    cloudLogServerEndpoint: 'http://robustly.io/api/logs',
    streams: []  // advanced: custom streams can be subscribed for plugin support.
  });

  return api(config);

};