var pubSub=require('../pub-sub');
var cloud=require('../cloud-manager');
var goal=require('../goals/index.js')

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
    success:function(a){
      logEntry('log',"success",a,temp)
      return a
    },
    failure:function(){
      if(!err)return;
      logEntry("error","failure",err,temp)
      throw err
    },
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

log.failure=function(err){
  if(!err)return;
  logEntry("log","failure",err)
  throw err
};


log.addEventHandler=pubSub.addEventHandler;


log.goal=function(name,userObject,cloudObject){

  var newgoal=goal(name);
  var event={};
  _.extend(event,userObject,cloudObject)


  newgoal.log= _.partial(logEntry,'log',_,_,event),
  newgoal.debug= _.partial(logEntry,'debug',_,_,event);
  newgoal.error= _.partial(logEntry,'error',_,_,event);
  newgoal.fatal= _.partial(logEntry,'fatal',_,_,event);
  newgoal.warn= _.partial(logEntry,'warn',_,_,event);
  newgoal.complete=function(success){
    return newgoal.returnStatus("success")
  };
  newgoal.fail=function(failure){
    return newgoal.returnStatus("failure")
  };
  return newgoal;
};



module.exports=function(config){
  //helpers=logEntry(config);
  logEntry=require('../log-entry')(config).logEntry;
  return log;
};