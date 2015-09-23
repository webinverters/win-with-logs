
var fs=require('fs');
var path=require('path')
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
  if(checkSize()){
    rotateFile()
  }

  wait.incId()
  return writeLogEntry(data)
};


var maxSize=1000000;
var checkSizeInterval=1;
var checkInterval=0;
var current=0;
var currentFilePath

var name="log"

module.exports=function(thePath,theMaxSize,maxCount){
  maxSize=theMaxSize
  if(typeof name!=="string") throw new Error("name is not a string")
  currentFilePath=thePath;
  createStream(path.join(thePath,name+current+".log"))
  return m;
};

function checkSize(){
  checkInterval++
  if(checkInterval>checkSizeInterval){
    checkInterval=0;
  }
  if(checkInterval%checkSizeInterval==0){
    return fs.statSync(path.join(currentFilePath,name+current+".log")).size>maxSize

  }
  else{
    return true;
  }
}

function rotateFile(){
  current++;
  writableStream=fs.createWriteStream(path.join(currentFilePath,name+current+".log"))

}


