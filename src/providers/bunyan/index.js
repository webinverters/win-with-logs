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

BunyanLogger.prototype.log = function (level, msg, details, options) {
  if (!this.logger[level])throw new Error("invalid log level:"+level);
  var defer = p.defer();
  this.logPromise = defer;

  var logObject = {}

  if (details instanceof Error) {
    logObject.err = details
  } else {
    logObject.details = details
  }

  if (options && !_.isObject(options)) {
    console.log('DETECTED INVALID OPTIONS:', arguments)
    throw "Options must be an object"
  }

  if (options && _.isObject(options)) {
    lobObject = _.merge(logObject,options)
  }

  if (_.size(logObject) > 0)
    this.logger[level](logObject, msg)
  else
    this.logger[level](msg)


  return defer.promise;
};


module.exports = BunyanLogger
