function cloud() {
  this.robustKey = "";
  this.enableStreams = false;
  this.enableSomething = false;
}

cloud.prototype.sendGoal = function () {
};
cloud.prototype.uploadLogs = function () {
};


module.exports = function (config) {
  var temp = new cloud(config);

  return {
    sendGoal: temp.sendGoal.bind(temp)
  }
};