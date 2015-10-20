var Bunyan = require('bunyan');
/**
 *
 * @param _config
 */
function BunyanLogger(_config) {
  this.logPromise = false;

  var func = function (data) {
    if (this.logPromise) {
      var result = {
        message: data
      };
      this.logPromise.resolve(data);
      this.logPromise = false;
    }
  }.bind(this);

  //default bunyan config
  var config = {
    module: "",
    name: '',
    streams: [
      {
        level: 'trace',
        stream: {
          write: func
        },
        type: 'raw'
      }
    ]
  };

  config.name = _config.app;
  config.component = _config.component;
  config.env = _config.env;

  this.logger = Bunyan(config);
}

var allowedLogLevels = ["fatal", "error", "warn", "info", "debug", "trace"];

BunyanLogger.prototype.log = function (level, msg, details) {
  if (allowedLogLevels.indexOf(level) < 0)throw new Error("invalid log level");
  var defer = p.defer();
  this.logPromise = defer;
  this.logger[level](msg, details);
  return defer.promise;
};


module.exports = BunyanLogger
