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

// Note: no logging with log inside of a stream, considering it could result in an effective infinite recursion.
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

    console.log('chunk', chunk)
    console.log('encoding', encoding)
    var eventLabel = extractEventLabel(chunk.msg);
    if (eventLabel[0] == '@') {
      chunk.eventLabel = eventLabel.substr(1);
    }

    done();
  };

  return new TestStream();
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