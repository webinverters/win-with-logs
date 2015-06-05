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
    env: 'local',
    errorFile: '',
    logFile: '',
    debug: false,
    slackLoggingEnabled: false,
    slackConfig: {
      webhook_url: "",
      channel: "",
      username: "bot"
    },
    enableTrackedEvents: true,
    streamName: 'Sewer',  // for tracked events, this will the be the kinesis stream name.
    streams: []
  });

  if (config.name == 'DefaultComponent' || config.app=='DefaultApp' || config.env=='local') {
    throw "win-with-logs: requires config to contain 'name', 'env', and 'app' properties.";
  }

  var winlogger = require('./src/log')(config, null, bunyan, PrettyStream, TrackedStream);

  winlogger.EventProcessor = require('./src/event-processor');
  return winlogger;
};