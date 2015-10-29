/**
 * @module rotating-file-max
 * @summary: Provides a rotating-file-max stream.
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

  var currentState = {
    fileSize: 0,
    filePath: path.join(config.logFilePath, config.logFileName),
    baseFileName: config.logFileName
    // maxLogFileSize: config.maxLogFileSize
  }

  var Writable = require('stream').Writable,
    util = require('util');

  function RotatingFileMaxStream() {
    Writable.call(this, {objectMode: true});
  }

  // create & open File
  // get size
  // save size to currentState
  var rotationCount = 0;
  function rotateFiles() {
    console.log('Log File Rotating...')
    if (currentState.fd) {
      fs.close(currentState.fd) // do not have to wait for it to close.
    }

    currentState.filePath = path.join(config.logFilePath, chooseFileName(config.logFileName))

    currentState.fd = fs.openSync(currentState.filePath, 'w+')
    currentState.fileSize = fs.statSync(currentState.filePath).size

    rotationCount = ((rotationCount+1) % config.maxLogFiles)
    console.log('Log File Rotated:', currentState.filePath)
  }

  function chooseFileName(fileName) {
    var parts = fileName.split('.')
    if (parts.length > 1) {
      parts[parts.length-2] += (rotationCount ? rotationCount : '')
      return parts.join('.')
    } else {
      return fileName + (rotationCount ? rotationCount : '')
    }
  }

  rotateFiles()

  function writeData(data, encoding) {
    var def = p.defer()
    //fs.write(fd, buffer, offset, length, position, callback)#
    fs.write(currentState.fd, new Buffer(data, encoding), 0, data.length, null, function(err, written, buff) {
      if (err) {
        return def.reject(err)
      }
      currentState.fileSize += written
      def.resolve()
    })

    return def.promise
  }

  util.inherits(RotatingFileMaxStream, Writable);
  RotatingFileMaxStream.prototype._write = function(chunk, encoding, done) {
    var data = JSON.stringify(chunk)+'\n'
    // console.log('File Write Count:', data.length)
    var logEventMeta = streamPromises[chunk._id]
    if (!logEventMeta) {
      console.log('chunk id', chunk._id)
      console.log('logEventMeta', streamPromises)
      logEventMeta = {promises: []}
    }

    if ((currentState.fileSize + data.length) <= config.maxLogFileSize) {
      logEventMeta.promises.push(writeData(data, encoding).then(done))
    } else {
      rotateFiles()
      logEventMeta.promises.push(writeData(data, encoding).then(done))
    }
  };

  return new RotatingFileMaxStream();
};
