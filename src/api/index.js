var logEntry=require('../log-entry');

var helpers;

function ctx(param){
  return {
    log:function(msg,details){
      helpers.logEntry("log",msg,details,param)
    },
    debug:function(msg,details){
      helpers.logEntry("debug",msg,details,param)
    },
    warn:function(msg,details){
      helpers.logEntry("warn",msg,details,param)
    },
    error:function(msg,details){
      helpers.logEntry("error",msg,details,param)
    },
    fatal:function(msg,details){
      helpers.logEntry("fatal",msg,details,param)
    }
  }

}


var logObj={
  debug:function(msg,details){
    helpers.logEntry("debug",msg,details)
  },
  warn:function(msg,details){
    helpers.logEntry("warn",msg,details)
  },
  error:function(msg,details){
    helpers.logEntry("error",msg,details)
  },
  fatal:function(msg,details){
    helpers.logEntry("fatal",msg,details)
  }
}


var contex={
  module:function(name){
    return ctx({module:name})
  },
  method:function(name){
    return ctx({method:name})
  },
  function: function (name) {
    return ctx({function: name})
  }
}

var others={
  addEventHandler:function(){},
  queryEvents:function(){},
  getLogs:function(){},
  goal:function(){},
  failedGoal:function(){},
  completedGoals:function(){},
  result: function (name) {
    return name
  },
  rejectWithCode: function (a) {
    return a
  }
}



var log=function(msg,details){
  return helpers.logEntry("log",msg,details)
}


_.extend(log,contex,logObj,others)




module.exports=function(config){
  helpers=logEntry(config);



  return log;
}