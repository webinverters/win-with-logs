/**
 * @module final-stream
 * @summary: This stream runs after all other streams to resolve promises etc...
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-05-23.
 * @license Apache-2.0
 */

"use strict";


var fs = require('fs'),
  path = require('path'),
  Transform = require('stream').Transform,
  p = require('bluebird');


module.exports = function construct(config, streamPromises) {
  config = config ? config : {};

  var Writable = require('stream').Writable,
    util = require('util');

  function FinalStream() {
    Writable.call(this, {objectMode: true});
  }

  util.inherits(FinalStream, Writable);
  FinalStream.prototype._write = function(chunk, encoding, done) {
    return p.resolve()
      .then(function() {
        var logEventMeta = streamPromises[chunk._id]
        if (logEventMeta && logEventMeta.promises) {
          // console.log('Final Promises:', logEventMeta.promises.length)
          return p.all(logEventMeta.promises).then(function() {
            logEventMeta.finalDef.resolve()
          })
          .catch(function(err) {
            // finalDef = final defferred which needs to be called to resolve
            // the promise returned from log()
            logEventMeta.finalDef.reject(err)
          })
          .finally(function() {
            delete streamPromises[chunk._id]
            done()
          })
        } else {
          done()
        }
      })
  };

  return new FinalStream();
};
