var exec = require('child_process').exec
var p = require('bluebird');

module.exports = function (cmd) {
  var temp = p.defer();
  exec(cmd, function (error) {
    if (error) {
      throw new Error("unable to execute command", error)
    }
    temp.resolve();
  });
  return temp.promise;
};