
var fileManagerInstance;
var fsManager=require('../fs-manager');
var logFormat=require('../log-format');
var pubSub=require('../pub-sub')

var bunyan;




var m={};

/**
 * logs an entry and returns a promise.
 * @param log
 * @param details
 * @param msg
 * @param context
 * @returns {*}
 */
m.logEntry=function(log,msg,details,context){

  var contexts=Array.prototype.slice.call(arguments,3,20)//arguments is sometimes an object and not an array.


  //do something, apply all nested contexts.


  if(true){//todo fix to handle logic.
    if(typeof msg=="string"){
      pubSub.handleEvent(msg)
    }
  }

  var logObj={};
  var theMsg=false;
  if(context){
    if(context.goal){
      logObj.goal=context.goal
    }else{
      logObj.context=context
    }
  }

  if(typeof msg=="object"){
    theMsg=JSON.stringify(msg);
  }else if(msg){
    theMsg=msg;
  }

  if(typeof details=="object" ){
    logObj.details=JSON.stringify(details);
  }else if(details){
    logObj.details=details;
  }


  if(typeof msg=="string" && typeof details=="string"){
    logObj.msg=msg+" "+details;
  }


  bunyan.debug(theMsg,logObj)




  return fileManagerInstance.waiter()
};


/**
 * handles the logic of newing up a config.
 * @param _config
 * @returns {{}} returns a logEntry method
 */
module.exports=function(_config){
  //news up fileManager
  fileManagerInstance=fsManager(_config.logFilePath,_config.maxLogFileSize,5);

  //
  bunyan = logFormat(_config,fileManagerInstance.writeLogEntry);
  return m;
};