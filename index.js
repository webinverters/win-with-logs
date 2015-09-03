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
var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var TrackedStream = require('./src/tracked-stream');

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

  if (config.name == 'DefaultComponent' || config.app=='DefaultApp') {
    throw "win-with-logs: requires config to contain 'name' and 'app' properties.";
  }

  var stub = function() {return p.reject('robustKey missing')};

  var robustClient = { getLogs:stub , postLogEvents: stub }
  if(config.robustKey) {
    robustClient = require('./src/robust-client')(config);
  }

  var log = require('./src/log')(config, null, bunyan, PrettyStream, TrackedStream, robustClient);

  //log.debug('WIN-WITH-LOGS Initialized', config)

  return log;
};