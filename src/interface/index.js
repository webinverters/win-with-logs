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

function fileConfig(logFilePath,maxLogFileSize,maxLogFiles){
  if(!logFilePath)throw new Error("missing logFilePath");
  if(!maxLogFileSize)throw new Error("missing maxLogFileSize");
  if(!maxLogFiles)throw new Error("missing maxLogFiles");

  if(typeof logFilePath!=="string") throw new Error("invalid type");
  if(typeof maxLogFileSize!=="number") throw new Error("invalid type");
  if(typeof maxLogFiles!=="number") throw new Error("invalid type");

  this.logFilePath=logFilePath;
  this.maxLogFileSize=maxLogFileSize;
  this.maxLogFiles=maxLogFiles;
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
  fileConfig:fileConfig,
  logConfig:logConfig,
  cloudConfig:cloudConfig,
  context:context,
  log:log
};