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


var fs = require('fs'),
  Transform = require('stream').Transform,
  kinesis = require('kinesis'),
  KinesisStream = kinesis.KinesisStream;

var _ = require('lodash'),
    p = require('bluebird')


module.exports = function construct(config, sewer) {
  config = config ? config : {};

  sewer = sewer || kinesis.stream({
    name: config.streamName,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });

  var Writable = require('stream').Writable,
    util = require('util');

  var TrackedStream = function(config) {
    Writable.call(this, {objectMode: true});
  }

  util.inherits(TrackedStream, Writable);
  TrackedStream.prototype._write = function(chunk, encoding, done) {
    var eventLabel = extractEventLabel(chunk.msg);
    if (eventLabel[0] == '@') {
      chunk.eventLabel = eventLabel.substr(1);
      sewer.write(new Buffer(JSON.stringify(chunk)));
    }

    done();
  };

  return new TrackedStream();
};
