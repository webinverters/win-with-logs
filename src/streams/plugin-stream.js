/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-05-23.
 * @license Apache-2.0
 */

"use strict";

var _ = require('lodash'),
    p = require('bluebird'),
    Transform = require('stream').Transform

module.exports = function construct(config, plugins) {
  config = config ? config : {};

  var Writable = require('stream').Writable,
    util = require('util');

  var PluginStream = function(config) {
    Writable.call(this, {objectMode: true})
  }

  util.inherits(PluginStream, Writable);
  PluginStream.prototype._write = function(chunk, encoding, done) {
    _.each(plugins, function(plugin,name) {
      plugin.send((new Buffer(JSON.stringify(chunk))))
    })
    done()
  }

  return new PluginStream();
}
