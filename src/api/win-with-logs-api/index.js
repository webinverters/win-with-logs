var loggerApi = require('../logger-api');
var bunyan = require('../../providers/bunyan');
var transport = require('../../data-types/transport-type')


function api(config) {
  this.bunyanInstance = new bunyan(config);

  var transportInstance = new transport;
  transportInstance.addTransport(function (a) {
    console.log(a.logString)
  }, "log", "debug")

  loggerApi.call(this, this.bunyanInstance, transportInstance)

  //this.loggerApi=new loggerApi(this.bunyanInstance);


}


api.prototype = _.extend({}, loggerApi.prototype)
api.prototype.constructor = api;


module.exports = api;

