var loggerApi = require('../logger-api');
var goalApi = require('../goal-api');
var bunyan = require('../../providers/bunyan');
var transport = require('../../data-types/transport-type');
var pubSub = require('../../providers/pub-sub');
var _=require('lodash')


function api(config) {
  this.bunyanInstance = new bunyan(config);

  this.transportInstance = new transport;
  this.transportInstance.addTransport(function (a) {
    console.log(a.logString)
  }, "log", "debug")
  this.pubSubInstance = new pubSub;


  this.transportInstance.addTransport(function (a) {
    if (a && a.args && a.args.msg && typeof a.args.msg[0] == "string" && a.args.msg[0][0] == "@") {
      this.pubSubInstance.handleEvent(a.args.msg[0])
    }
  }.bind(this), "log", "debug");


  loggerApi.call(this, this.bunyanInstance, this.transportInstance)



}


api.prototype = _.extend({}, loggerApi.prototype)
api.prototype.constructor = api;

api.prototype.goal = function (goalName, prop1, prop2) {
  var temp=new goalApi(goalName, prop1, prop2, this.bunyanInstance, this.transportInstance)
  return temp;
};
api.prototype.addEventHandler = function (event, handler) {
  this.pubSubInstance.addEventHandler(event, handler);
};


module.exports = api;

