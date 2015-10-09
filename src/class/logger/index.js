var logMessageType = require('../../data-types/log-message-type');
var transportType = require('../../data-types/transport-type');
var contextType = require('../../data-types/context-type');


function logger(bunyan) {
  if (typeof bunyan !== "object") throw new Error("invalid bunyan")

  this.bunyan = bunyan;
  this.contextInstance = new contextType;
  this.transport = new transportType;

  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof logger) {
    this.bunyan = arguments[0].bunyan;//shouldn't need to make a copy of bunyan since it's a provider.

    this.contextInstance = new contextType(arguments[0].contextInstance);
    this.transport = new transportType(arguments[0].transport);
  }
}

logger.prototype.addTransport = function (func, type, level) {
  this.transport.addTransport(func, type, level);
};

logger.prototype.addContext = function (name, type) {
  this.contextInstance.addContext(name, type);
};


logger.prototype.logEntry = function (message, level) {
  var data=new logMessageType(message);
  data.mergeContext(this.contextInstance);

  return p.resolve()
    .bind(this)
    .then(function () {
      return this.bunyan.log.apply(null,data.getArgs())
    })
    .then(function (bunyanResult) {
      var data = {
        logString: bunyanResult,
        args: message
      };
      return p.map(this.transport.actions, function (transportItem) {
        //transportItem.type do something with it?
        if (level == transportItem.level) {
          return transportItem.func(data)
        }
      })
    })
    .then(function () {
      return true;
    });
};


module.exports = logger;