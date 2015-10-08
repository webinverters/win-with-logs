//var loggerApi=require('../data-structures').loggerApi
var winWithLogs_api=require('../data-structures/win-with-logs-api')




module.exports=function(config){
  //validate config


  var loggerInstance=new winWithLogs_api();


  //lots of convoluted code for just the convience of log.....
  //var log=function(){};
  //log.warn=function(){};
  //log.error=function(){};
  //log.debug=function(){};
  //log.fatal=function(){};
  //
  //log.context=function(name){
  //  return new loggerApi();
  //};


  //if config/do shit
  return loggerInstance;




}