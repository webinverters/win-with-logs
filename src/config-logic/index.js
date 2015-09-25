var fs=require('fs');
var features={};

module.exports=function(config){

  //handle missing properties errors for basic config.

  if (!config.app) throw new Error("missing app property");
  if (!config.env) throw new Error("missing env property");
  if (!config.component) throw new Error("missing component property");


  //handle filesystem

  //by default fs is enabled.
  features.fsEnabled=true;

  if (config.disableFs) features.fsEnabled = false;

  //source debugging
  if (config.debug == true) features.stackTraceEnabled = true;







  //Disable fs if we are in the browser.
  //this assumes fs is undefined when run through browserify.
  if(fs==undefined) features.fsEnabled=false;


  //cloud source
  if(config.cloudConfig || config.robustKey){//a cloud property exist, check for valid properties
    if(!(config.robustKey)) throw new Error("missing property config.robustKey")

  }


  return _.defaults(features,{
    fsEnabled:true,
    cloudEnabled:false,
    consoleEnabled:true,
    client:"node",
    stackTraceEnabled:false,
    pubSubEnabled:true
  })


}


//flags
  config.debug


//config.component
//config.env
//config.app


//config.debug(boolean)
//config.disableFs
//config.cloud
//config.enableFSLogging(boolean)

//config.logFilePath (string)  [./log]
//config.eventFilePath (string) [./events]
//config.errorFilePath (string) [./errors]

//config.maxLogFileSize (number) [1024*1000]
//config.maxLogFiles (number) [5]


//config.robustKey (string)
//config.cloudConfig.enabledTrackEvents (boolean)
//config.cloudConfig.trackedEventSendInterval (number) [5000ms]
//config.cloudConfig.enableLogStreaming (boolean) [true]
//config.cloudConfig.logSendInterval (number) [5000ms]

//config.goalLogFilePath(string)