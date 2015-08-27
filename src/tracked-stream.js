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


module.exports = function construct(config, sewer) {
  config = config ? config : {};

  sewer = sewer || kinesis.stream(config.streamName);


  var Writable = require('stream').Writable,
    util = require('util');

  var TrackedStream = function(config) {
    Writable.call(this, {objectMode: true});
  };
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

/**
 * Returns the event label embedded in the string.
 *
 * The event label is defined as the first string before any spaces in the string.
 *
 * @param str
 */
function extractEventLabel(str) {
  if (str.indexOf(' ') > 0) {
    return str.split(' ')[0];
  }
  else return str;
}