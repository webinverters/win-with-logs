var fs=require('fs');
var fsHelper={};


fsHelper.hasFile=function(dir,name){
  return _.filter(fs.readdirSync(dir),function(files){
      return files==name
    })[0]==name;
};

fsHelper.containLines=function(filePath,arrayoflines){
  arrayoflines=arrayoflines||[];
  var file=fs.readFileSync(filePath,"utf8").split('\n')
  var result=true;
  if(file.length<1) return false;
  if(file.length==1 && file[0]=='') return false;
  _.forEach(arrayoflines,function(value,key){
    if(file[key].indexOf(value)<0){
      result=false;
    }
  });
  return result;

};
module.exports=fsHelper