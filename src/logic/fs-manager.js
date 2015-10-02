var _=require('lodash')
var fs=require('fs');
var path=require('path')

function fileManager(config){
  this.name="log";
  this.current=0;
  this.directory=config.logFilePath;


  this.path=path.join(this.directory,this.name+this.current+".log")
  this.currentStream=fs.createWriteStream(this.path)

}


module.exports=fileManager