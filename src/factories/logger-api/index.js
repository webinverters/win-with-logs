var log = require('../../data-structures').log_type;
var context = require('../../data-structures').context;
var transports = require('../../data-structures').transports;


function logger(bunyan, context, transportsInstance) {
  this.bunyan = bunyan;
  this.theContext = context;
  this.transports = [];
  if (transportsInstance) {
    this.transports = transportsInstance.actions
    if (typeof transports == "object") this.transports = transportsInstance;
  }


  this.logger = function (data, context) {
    var tempContext = _.extend({}, this.theContext.fullContext, context)
    return this.bunyan.log(data, tempContext)
      .then(function (result) {
        var loggedResult = JSON.stringify(result);
        return p.map(this.transports, function (transportFunc) {
          return transportFunc(loggedResult)
        })
      }.bind(this))
  }
}

logger.prototype.addTransport = function (func) {
  this.transports.push(func)
}

logger.prototype.log = function (msg, details) {
  var temp = new log({name: msg, obj: details, level: "log"})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.warn = function (msg, details) {
  var temp = new log({name: msg, obj: details, level: "warn"})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.fatal = function (msg, details) {
  var temp = new log({name: msg, obj: details, level: "fatal"})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.debug = function (msg, details) {
  var temp = new log({name: msg, obj: details, level: "debug"})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.error = function (msg, details) {
  var temp = new log({name: msg, obj: details, level: "error"})
  return this.logger(temp.msg, temp.obj)
};

logger.prototype.success = function () {
};
logger.prototype.failure = function () {
};

logger.prototype.context = function (name) {
  var newContext = _.extend(this.theContext, {context: name});
  return new logger(this.bunyan, newContext, new transports(this.transports))
}


module.exports = logger;