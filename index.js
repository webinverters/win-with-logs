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

var winWithLogs=require('./src/win-with-logs');

module.exports = function construct(config) {
  config = config ? config : {};
  config = _.defaults(config, {
    name: 'DefaultComponent',
    app: 'DefaultApp',
    env: 'dev',
    logErrorFile: './',
    logFilePath: './',
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

  return winWithLogs(config);

};