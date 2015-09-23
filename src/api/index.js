var pubSub=require('../pub-sub');


var logEntry=function(){};//stub to be overridden when intialized.

var log=function(msg,details){
  return logEntry("log",msg,details)
};
log.debug=function(msg,details){
  return logEntry("debug",msg,details)
};
log.error= function(msg,details){
  return  logEntry("error",msg,details)
};
log.fatal= function(msg,details){
  return  logEntry("fatal",msg,details)
};
log.warn= function(msg,details){
  return logEntry("warn",msg,details)
};
log.currentContext="";


function createContext(self,context){
  var temp=context;
  if(self.currentContext){
    temp=self.currentContext+"-"+context;
  }
  return {
    currentContext:temp,
    log: _.partial(logEntry,'log',_,_,temp),
    debug: _.partial(logEntry,'debug',_,_,temp),
    error: _.partial(logEntry,'error',_,_,temp),
    fatal: _.partial(logEntry,'fatal',_,_,temp),
    warn: _.partial(logEntry,'warn',_,_,temp),
    context:function(a){
      return createContext(this,a)
    }
  }

}


log.context=function(a){
  return createContext(this,a);
};

log.module=function(a){
  return createContext(a);
};

log.success=function(a){
  logEntry("log","success",a)
  return a
};




log.addEventHandler=pubSub.addEventHandler;




module.exports=function(config){
  //helpers=logEntry(config);
  logEntry=require('../log-entry')(config).logEntry;

  //var stub=function(){};
  //stub.abc=5;

  return log;
};