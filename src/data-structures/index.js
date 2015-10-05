function log(param) {
  var name = param.name;
  var obj = param.obj;
  var context = param.context;

  if (!name) throw new Error("missing name property");

  this.msg = name;
  this.obj = false;
  this.context = false;
  if (context) this.context = context;


  if (typeof name == "string" && typeof obj == "string") {
    this.msg = name + " " + obj;
  }
  if (typeof name == "object") {

    this.msg = JSON.stringify(name);
    this.obj=JSON.stringify(name);
    if (typeof obj == "object") {
      this.obj = obj;
    }
  }

  if (!obj) return//normal;
  if (obj) {
    if (typeof name == "string" && typeof obj == "object") {
      this.obj = obj;
    }
  }
}


function context() {
  this.fullContext = {};
}

context.prototype.addContext = function (name, type) {
  this.context[type] = name;
};

function transports(theArray) {
  if (typeof theArray !== "object" || typeof theArray.length!=="number") throw new Error("invalid parameter, need an array")
  this.actions = theArray;
}


module.exports = {
  log: log,
  context: context,
  transports: transports
};