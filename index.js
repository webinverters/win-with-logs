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
  var m = {};
  config = config ? config : {};
  config = _.defaults(config, {});

  return require('./src/log')(config, null, bunyan, PrettyStream, TrackedStream);
};