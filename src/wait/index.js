
var id=0;

var waiters={}
function resolveWait(the_id){
  waiters[the_id].done();
}
function rejectWait(err){
  waiters[the_id].reject(err);
}

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
  if(id>2000111000) id=0;//prevent an overflow in the rare event it happens.
  return temp.promise;
}

function wait(){

}
wait.prototype.getId=function(){return id;};
wait.prototype.incId=function(){return id++};
wait.prototype.waiter=waiter;
wait.prototype.resolveWait=resolveWait;
wait.prototype.rejectWait=rejectWait;

module.exports=new wait