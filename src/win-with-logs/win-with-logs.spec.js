var winWithLogs=require('./index')

describe('winWithLogs',function(){
  var log
  before(function(){
    log=winWithLogs({});
  });
  it('basic structure',function(){

    log.log("hi");
    log.warn("hi");
    log.error("hi");
    log.debug("hi");
    log.fatal("hi");

    log.returnSuccess();
    log.returnFailure();

    var ctx=log.context("test")
    ctx.log("hi")
    ctx.warn("hi")
    ctx.error("hi")
    ctx.debug("hi")
    ctx.fatal("hi")

    var temp1=log.module()
    var temp2=log.method()
    var temp3=log.function()

    log.addEventHandler(1,2)






  })
})