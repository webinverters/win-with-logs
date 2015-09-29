function log(msg,details){
  if(typeof msg!=="string") throw new error("invalid msg");
  if(typeof details!=="object") throw new error("invalid details");
  this.msg=msg;
  this.details=details;
}


function context(param){
  if(typeof param!=="object") throw new error("invalid context");
  this.params=param
}

function fs(param){
  this.path;
  this.name;
  this.maxSize;
}

function logConfig(component,app,env){
  this.component=component;
  this.app=app;
  this.env=env;
}

function cloudConfig(){
  this.robustKey;
  this.cloudUrl;
}


function errorObject(stackTrace,lineNumber,fileName){
  this.stackTrace;
  this.lineNumber;
  this.fileName;
}


module.exports={
  fs:fs,
  logConfig:logConfig,
  cloudConfig:cloudConfig,
  context:context,
  log:log
};