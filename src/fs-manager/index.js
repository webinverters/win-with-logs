
var fs=require('fs');
var wait=require('../wait');



var writableStream;//stub for stream to be initialized.

function createStream(path){
  writableStream=fs.createWriteStream(path);
}

function writeLogEntry(data){
  var tempId=wait.getId()
  writableStream.write(JSON.stringify(data)+"\n",function(err){
    if(err){
      //rejectWait(err)//perhaps application shouldn't break due to a logging error.
    }
    wait.resolveWait(tempId)
  });
}




var m={}
m.waiter=wait.waiter;//track the current entry in the stream.
m.writeLogEntry=function(data){
  wait.incId()
  return writeLogEntry(data)
};


module.exports=function(path,maxSize,maxCount){
  createStream(path)
  return m;
};