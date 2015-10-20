var _ = require('lodash');
var p = require('bluebird');

function cloud() {
  this.interval = 300;
  this.queue=[];
}
function logData(data,promise){
  this.data;
  this.promise;
}

function flush(){
  _.forEach(this.queue,function(value){

    value.promise.resolve(true);
  }.bind(this))
}

function log(a) {
  //a.logString;
  //a.logObject;
  this.queue.push(new logData);
  //return promsie

}
function flush() {
  //return promise
}


_.extend(cloud.prototype, {
  log: log,
  flush: flush
});


module.exports = function (config) {

  var temp = new Cloud(config)

};