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


module.exports = pubSub;