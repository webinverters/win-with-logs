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

pubSub.prototype.handleEvent = function (msg) {
  if (typeof msg !== "string") return;
  if (msg[0] !== "@") return;
  var event = msg.slice(1)

  if (this.events[event]) {
    return p.map(this.events[event], function (func) {
      return func()
    }, {concurrency: 1})
  }
  return p.resolve(true)
};


module.exports = pubSub;