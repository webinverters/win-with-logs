function context_type(param) {
  this.fullContext = param || {};

  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof context_type) {
    this.fullContext = _.cloneDeep(arguments[0].fullContext)
  }
}

//recursive function to add a new unique property to an object.
function set(obj, type, name, layer) {
  if (layer == 0) {
    if (obj[type]) {
      set(obj, type, name, layer + 1);
      return
    }
    obj[type] = name;
    return
  }
  if (obj[type + layer]) {
    set(obj, type, name, layer + 1)
    return
  }
  obj[type + "_" + layer] = name;
}

context_type.prototype.addContext = function (name, type) {
  set(this.fullContext, type, name, 0);
};


module.exports = context_type;