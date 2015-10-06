var _ = require('lodash');
var p=require('bluebird');



function pubSub() {
  this.events = {};
}


pubSub.prototype.addEventHandler = function (event, func) {
  if (!func) throw new Error("not enough arguments");
  if (this.events[event]) {
    this.events[event].push(func)
  } else {
    this.events[event] = [func]
  }
};

pubSub.prototype.addEventHandler.handleEvent = function (event) {
  if (this.events[event]) {
    _.forEach(this.events[event], function (func) {
      func(event);
    })
  }
};


function goal(name) {
  this.name = name;
  this.time = new Date().getTime();
  this.history = [];
}

goal.prototype.addEntry = function (name) {
  this.history.push({
    log: name,
    time: new Date().getTime() - this.time
  })

};
goal.prototype.returnStatus = function (status) {
  return {
    goal: this.name,
    duration: new Date().getTime() - this.time,
    history: this.history
  }
};


var m = {};
m.logger = require('./logger');
m.pubSub = pubSub;
m.goal = goal;

module.exports = m;