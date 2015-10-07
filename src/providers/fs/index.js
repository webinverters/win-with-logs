//function fsProvider() {};
//var m = new fsProvider;
//
//m.test=function(){};


var fs = require('fs');
var path = require('path')

function fileManager(config) {
  this.name = "log";
  this.current = 0;
  this.directory = config.logFilePath;
  this.maxSize = config.maxLogFileSize
  this.maxFiles = config.maxLogFiles;

  this.current = this.deleteOldFiles();
  this.path = path.join(this.directory, this.name + this.current + ".log")
  this.currentStream = fs.createWriteStream(this.path)

}

fileManager.prototype.write = function (a) {
  if (this.checkSize()) {
    this.current = this.deleteOldFiles();
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

fileManager.prototype.checkSize = function () {
  return fs.statSync(this.path).size > this.maxSize
};

fileManager.prototype.deleteOldFiles = function () {
  var files =
    _(fs.readdirSync(this.directory))
      .filter(function (name) {
        return name.indexOf("log") > -1
      }).value()

  files.sort(function (a, b) {
    return fs.statSync(this.directory + a).mtime.getTime() -
      fs.statSync(this.directory + b).mtime.getTime();
  }.bind(this));


  var deletedFiles = false
  var filesToDelete = 0;
  if (files.length == this.maxFiles) filesToDelete = 1;
  if (files.length > this.maxFiles) {
    filestoDelete = files.length - this.maxFiles - 1
  }
  if (files.length >= this.maxFiles) {
    _.forEach(_.dropRight(files, filestoDelete), function (file) {
      fs.unlinkSync(path.join(this.directory, file))
      deletedFiles = true;
    }.bind(this))
  }

  if (!deletedFiles)return this.current

  var highestint = _.max(_(files)
    .map(function (name) {
      var count = name.match(/log(.+?)\.log/)
      if (!count)return 0;
      return parseInt(count[1])
    })
    .value());

  if (highestint == -Infinity)return 0
  return highestint + 1

};


module.exports = fileManager;