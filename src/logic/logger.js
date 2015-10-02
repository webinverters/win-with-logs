

function logger(config, bunyan) {
  this.bunyan = bunyan;
  this.transports=[];

  this.logger = function (data) {
    return this.bunyan.log(data)
      .then(function (result) {
        var loggedResult=JSON.stringify(result);
        return p.map(this.transports,function(transportFunc){
          return transportFunc(loggedResult)
        },{concurrency:1})
      }.bind(this))
  }
}

logger.prototype.addTransport=function(func){
  this.transports.push(func)
}

logger.prototype.log = function (msg, context) {

  return this.logger(msg, context)
};
logger.prototype.warn = function (msg, context) {
  return this.logger(msg, context)
};
logger.prototype.trace = function (msg, context) {
  return this.logger(msg, context)
};
logger.prototype.fatal = function (msg, context) {
  return this.logger(msg, context)
};
logger.prototype.debug = function (msg, context) {
  return this.logger(msg, context)
};
logger.prototype.error = function (msg, context) {
  return this.logger(msg, context)
};


module.exports=logger;