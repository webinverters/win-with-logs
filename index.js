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

var _ = require('lodash');
module.exports = function construct(config) {
  var m = {};
  config = config ? config : {};
  config = _.defaults(config, {});

  return require('./src/log')(config);
};