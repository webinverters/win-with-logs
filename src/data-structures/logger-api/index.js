function loggerApi(transport, context, bunyan) {

  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof loggerApi) {
    //this.stuff = _.cloneDeep(arguments[0].stuff)
  }
}


loggerApi.prototype.log = function () {
};
loggerApi.prototype.warn = function () {
};
loggerApi.prototype.debug = function () {
};
loggerApi.prototype.error = function () {
};
loggerApi.prototype.fatal = function () {
};
loggerApi.prototype.context = function () {

  return new loggerApi
};


module.exports = loggerApi;