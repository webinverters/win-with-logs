/**
 * The purpose of this module is to abstract away what we call to bunyan
 */
function logMessage_type(msg, details, type) {
  this.msg;
  this.details;

  this.args = []
  if (this.msg) this.args.push(this.msg);
  if (this.details) this.args.push(this.msg)


  //type should be able to pass itself as a parameter
  if (arguments.length == 1 && arguments[0] instanceof logMessage_type) {
    //this.fullContext = _.cloneDeep(arguments[0].fullContext)
  }
};


module.exports = logMessage_type;