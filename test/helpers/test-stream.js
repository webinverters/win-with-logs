/**
 * @module test-stream
 * @summary: Implements a log stream that is used for testing log streams work as intended in win-with-logs.
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-09-02.
 * @license Apache-2.0
 */

"use strict";

module.exports = function construct(config, cb) {
  config = config ? config : {};

  var Writable = require('stream').Writable,
    util = require('util');

  var TestStream = function(config) {
    Writable.call(this, {objectMode: true});
  };
  util.inherits(TestStream, Writable);
  TestStream.prototype._write = function(chunk, encoding, done) {
    if (cb) cb.apply(this, arguments)

    // console.log('chunk', chunk)
    // console.log('encoding', encoding)
    done()
  };

  return new TestStream();
};
