var Bunyan = require('bunyan');

function bunyanLogger(_config) {
  this.logPromise = false;

  var func = function (data) {
    if (this.logPromise) {
      var result = {
        message: JSON.stringify(data)
      }
      this.logPromise.resolve(result)
      this.logPromise = false;
    }
  }.bind(this);

  //default bunyan config
  var config = {
    module: "",
    name: '',
    streams: [
      {
        level: 'debug',
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

bunyanLogger.prototype.log = function (msg, details) {
  var defer = p.defer();
  this.logPromise = defer;
  this.logger.debug(msg, details);
  return defer.promise;
};


module.exports = bunyanLogger
