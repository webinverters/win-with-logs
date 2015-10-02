function logger(config, bunyan) {
  this.bunyan = bunyan;

  this.logger = function (data) {
    return this.bunyan.log(data)
      .then(function (result) {
        console.log(JSON.stringify(result))
      })
  }
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