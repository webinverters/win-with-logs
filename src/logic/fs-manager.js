var _ = require('lodash')
var fs = require('fs');
var path = require('path')
var p = require('bluebird');

function fileManager(config) {
  this.name = "log";
  this.current = 0;
  this.directory = config.logFilePath;
  this.maxSize=config.maxLogFileSize


  this.path = path.join(this.directory, this.name + this.current + ".log")
  this.currentStream = fs.createWriteStream(this.path)


}

fileManager.prototype.write = function (a) {
  if(this.checkSize()){
    this.rotateFile()
  }

  var defer = p.defer();
  this.currentStream.write(a, function () {
    defer.resolve();
  });
  return defer.promise;
};

fileManager.prototype.rotateFile = function () {
  this.current += 1;
  this.path = path.join(this.directory, this.name + this.current + ".log")
  this.currentStream = fs.createWriteStream(this.path);
};

fileManager.prototype.checkSize=function(){
  return fs.statSync(this.path).size>this.maxSize
}


module.exports = fileManager;