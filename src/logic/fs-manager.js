var _ = require('lodash')
var fs = require('fs');
var path = require('path')
var p = require('bluebird');

function fileManager(config) {
  this.name = "log";
  this.current = 0;
  this.directory = config.logFilePath;


  this.path = path.join(this.directory, this.name + this.current + ".log")
  this.currentStream = fs.createWriteStream(this.path)


}

fileManager.prototype.write = function (a) {
  var defer = p.defer();
  this.currentStream.write(a, function () {
    defer.resolve();
  });
  return defer.promise;
};


module.exports = fileManager;