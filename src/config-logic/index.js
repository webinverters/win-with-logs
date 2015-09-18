

module.exports=function(config){
  if(!config.app) throw new Error("missing app property");
  if(!config.env) throw new Error("missing env property");
  if(!config.component) throw new Error("missing component property");



  return {
    fsEnabled:true,
    cloudEnabled:false,
    consoleEnabled:true,
    client:"node",
    srcLogging:false,
  }


}