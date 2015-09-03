/**
 * @module cloud-stream
 * @summary: This stream sends log data to the cloud server endpoint.
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-09-02.
 * @license Apache-2.0
 */

"use strict";

module.exports = function construct(config, cloud) {
  config = config ? config : {};

  var Writable = require('stream').Writable,
    util = require('util');

  var CloudStream = function() {
    Writable.call(this, {objectMode: true});
  };
  util.inherits(CloudStream, Writable);

  // TODO: convert this to read the log file and send log events accordingly.
  // So that it automatically queues and sends all the log events in the event of temporary failure.
  CloudStream.prototype._write = function(chunk, encoding, done) {
    return cloud.postLogEvents([chunk])
      .catch(function(err) {
        console.log('Failed to post log event')
        throw err
      })
      .then(done)
  };

  return new CloudStream();
};