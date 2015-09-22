var _=require('lodash');

var events={};
function pubSub(){};

function addEventHandler(event,func){
  if(!func) throw new Error("not enough arguments");


  if(events[event]){
    events[event].push(func)
  }else{
    events[event]=[func]
  }
};

function handleEvent(event){
  if(events[event]){
    _.forEach(events[event],function(func){
      func(event);
    })
  }
}

pubSub.prototype={
  addEventHandler:addEventHandler,
  handleEvent:handleEvent
}






module.exports=new pubSub;