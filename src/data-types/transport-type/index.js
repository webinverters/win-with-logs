function transport() {
  this.actions = [];


  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof transport) {
    this.actions = _.cloneDeep(arguments[0].actions)
  }
}

transport.prototype.addTransport = function (func,type, level) {
  this.actions.push({func: func,type:type||"log", level: level || "debug"})
};

module.exports = transport;