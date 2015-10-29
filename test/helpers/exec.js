var exec = require('child_process').exec
var p = require('bluebird');

/**
 *
 * @param cmd shell command to execute
 * @returns {ret|*|promise} a promise that resolves when done
 */
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