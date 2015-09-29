var _ = require('lodash');

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
m.logger = logger;
m.pubSub = pubSub;
m.goal = goal;

module.exports = m;