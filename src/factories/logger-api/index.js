var log = require('../../data-structures').log_type;
var context = require('../../data-structures').context;
var transports = require('../../data-structures').transports;


function logger(bunyan, context, transportsInstance) {
  this.bunyan = bunyan;
  this.theContext = context;
  this.transports = [];
  if (transportsInstance) {
    this.transports = transportsInstance.actions
  }


  this.logger = function (data, context) {
    var tempContext = _.extend({}, this.theContext, context)
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
  var temp = new log({name: msg, obj: details})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.warn = function (msg, details) {
  var temp = new log({name: msg, obj: details})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.trace = function (msg, details) {
  var temp = new log({name: msg, obj: details})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.fatal = function (msg, details) {
  var temp = new log({name: msg, obj: details})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.debug = function (msg, details) {
  var temp = new log({name: msg, obj: details})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.error = function (msg, details) {
  var temp = new log({name: msg, obj: details})
  return this.logger(temp.msg, temp.obj)
};
logger.prototype.context = function (name) {
  var newContext = _.extend(this.theContext, {context: name});
  return new logger(this.bunyan, newContext, new transports(this.transports))
}


module.exports = logger;