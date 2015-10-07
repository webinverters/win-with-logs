
//
//function goal(name) {
//  this.name = name;
//  this.time = new Date().getTime();
//  this.history = [];
//}
//
//goal.prototype.addEntry = function (name) {
//  this.history.push({
//    log: name,
//    time: new Date().getTime() - this.time
//  })
//
//};
//goal.prototype.returnStatus = function (status) {
//  return {
//    goal: this.name,
//    duration: new Date().getTime() - this.time,
//    history: this.history
//  }
//};
//
//
var m = {};
m.loggerApi = require('./logger-api');
//m.pubSub = pubSub;
//m.goal = goal;

module.exports = m;