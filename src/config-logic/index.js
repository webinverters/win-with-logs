var features={};

module.exports=function(config){

  //handle missing properties errors

  if(!config.app) throw new Error("missing app property");
  if(!config.env) throw new Error("missing env property");
  if(!config.component) throw new Error("missing component property");

  var fsPropertyHasBeenSpecified=false;

  if(config.disableFs){
    features.fsEnabled=false;
  }

  if(config.maxLogFileSize){

  }


  if(fsPropertyHasBeenSpecified){

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