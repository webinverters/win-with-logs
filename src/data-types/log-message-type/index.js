/**
 * The purpose of this module is to abstract away what we call to bunyan
 */
function logMessage_type(msg, details) {
  this.msg = msg || false;
  this.details = details || false;
  this.extraArgs = false;
  if (arguments.length > 2)this.extraArgs = arguments;


  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof logMessage_type) {
    this.msg = _.cloneDeep(arguments[0].msg);
    this.details = _.cloneDeep(arguments[0].details);
    this.extraArgs = _.cloneDeep(arguments[0].extraArgs);
  }
};

logMessage_type.prototype.getArgs = function () {
  var temp = [];
  if (this.msg) temp.push(this.msg);
  if (this.details) temp.push(this.details);

  if (this.extraArgs) {
    //todo do we want to supprt random messages?
    //console.log(_.toArray(this.extraArgs))
  }
  return temp;
}

logMessage_type.prototype.mergeContext = function (obj) {
  this.details = _.merge({}, this.details, obj);
};


module.exports = logMessage_type;