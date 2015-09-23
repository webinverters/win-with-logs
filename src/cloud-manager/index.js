var helper;


function cloudManager(){


}
var queue=[];

cloudManager.prototype.writeLogEntry=function(data){
  queue.push(data)
};




function sendToCloud(){
  return helper.uploadToCloud(queue)
    .then(function(){
      queue=[];
    })
}


module.exports=function(_config){

  if(!_config.robustKey) throw new Error("robustKey was not specified");
  if(_config.enableTrackedEvents && _config.trackedEventSendInterval) console.log("hi")
  if(_config.enableLogStreaming && _config.logSendInterval) {
    setInterval(sendToCloud,_config.logSendInterval)
  }

  helper=require('./helper')(_config);




  return new cloudManager();

};


