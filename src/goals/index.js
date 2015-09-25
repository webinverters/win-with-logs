
function goal(name){
  this.name=name;
  this.time=new Date().getTime();
  this.history=[];


}

goal.prototype.addEntry=function(name){
  this.history.push({
    log:name,
    time:new Date().getTime()-this.time
  })

};
goal.prototype.returnStatus=function(status){
  return {
    goal:this.name,
    duration:new Date().getTime()-this.time,
    history:this.history
  }
};

module.exports=function(goalName){

  return new goal(goalName)
}