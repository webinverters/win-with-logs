//var loggerApi=require('../data-structures').loggerApi
var winWithLogs_api=require('../api/win-with-logs-api')

//var winWithLogs_api=require('../api/winWithLogs_api')




module.exports=function(config){
  //validate config



  var loggerInstance=new winWithLogs_api(config);


  return loggerInstance;




}