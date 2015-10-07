function log_Type(param) {
  var name = param.name;
  var obj = param.obj;
  var context = param.context;
  var level = param.level || "debug";

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
    this.obj = JSON.stringify(name);
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
  if (typeof theArray !== "object" || typeof theArray.length !== "number") throw new Error("invalid parameter, need an array")
  this.actions = theArray;
}


function log_args(msg, details) {
  if (typeof msg !== "string") throw new error("invalid msg");
  if (typeof details !== "object") throw new error("invalid details");
  this.msg = msg;
  this.details = details;
}


function file_config(logFilePath, maxLogFileSize, maxLogFiles) {
  if (!logFilePath)throw new Error("missing logFilePath");
  if (!maxLogFileSize)throw new Error("missing maxLogFileSize");
  if (!maxLogFiles)throw new Error("missing maxLogFiles");

  if (typeof logFilePath !== "string") throw new Error("invalid type");
  if (typeof maxLogFileSize !== "number") throw new Error("invalid type");
  if (typeof maxLogFiles !== "number") throw new Error("invalid type");

  this.logFilePath = logFilePath;
  this.maxLogFileSize = maxLogFileSize;
  this.maxLogFiles = maxLogFiles;
}

function log_config(component, app, env) {
  this.component = component;
  this.app = app;
  this.env = env;
}

//function context(param){
//  if(typeof param!=="object") throw new error("invalid context");
//  this.params=param
//}

//function errorObject(stackTrace,lineNumber,fileName){
//  this.stackTrace;
//  this.lineNumber;
//  this.fileName;
//}


module.exports = {
  log_type: log_Type,
  context: context,
  transports: transports,

  file_config: file_config,
  log_config: log_config,
  log_args: log_args
};