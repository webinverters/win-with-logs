var fs=require('fs');

var writableStream;

function createStream(path){
  writableStream=fs.createWriteStream(path);
}

function writeLogEntry(data){
  var tempId=id;
  writableStream.write(JSON.stringify(data)+"\n",function(err){
    if(err){
      //rejectWait(err)//perhaps application shouldn't break due to a logging error.
    }
    resolveWait(tempId)
  });
}

//keep tracks of all log entries
var id=0;
var waiters={}
function resolveWait(the_id){
  waiters[the_id].done();
}
function rejectWait(err){
  waiters[the_id].reject(err);
}


/**
 * returns a promise that resolves when entry is flushed.
 * @returns {*}
 */
function waiter(){
  var temp= p.defer()
  waiters[id]={
    done:function(){
      temp.resolve(true)
    },
    error:function(err){
      temp.reject(err)
    }
  };
  if(id>2000111000) id=0;
  return temp.promise;
}

var m={}
m.waiter=waiter;
m.writeLogEntry=function(data){
  id++;
  return writeLogEntry(data,id-1)
};




module.exports=function(path,maxSize,maxCount){
  createStream(path)
  return m;
};