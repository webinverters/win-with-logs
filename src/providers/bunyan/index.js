var Bunyan = require('bunyan');

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

BunyanLogger.prototype.log = function (level, msg, details, options) {
  if (allowedLogLevels.indexOf(level) < 0)throw new Error("invalid log level");
  var defer = p.defer();
  this.logPromise = defer;

  if (level == 'error' || level == 'fatal') {
    var err = details
    if (err instanceof Error) {
      this.logger[level]({err: err}, msg);
    }
    else if (!err.err) {
      this.logger[level]({details:err}, msg)
    }
    else {
      this.logger[level]({ details: err, err: err.err }, msg)
    }
  } else {
    if (options && !_.isObject(options)) throw "options must be an object"
    if (options && _.isObject(options)) {
      options.details = details
      this.logger[level](options, msg)
    }
    else if (details)
      this.logger[level]({details:details}, msg)
    else
      this.logger[level](msg)
  }

  return defer.promise;
};


module.exports = BunyanLogger
