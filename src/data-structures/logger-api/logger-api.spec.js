var loggerApi=require('./index');

describe('loggerApi',function(){
  it('world',function(){

    var log=new loggerApi;

    log.log();
    log.warn();
    log.debug();
    log.error();
    log.fatal();
    var ctx=log.context()
    ctx.log();
    ctx.warn();
    ctx.debug();
    ctx.error();
    ctx.fatal();


  })
})