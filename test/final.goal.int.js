var m = require('../src/api/final-api');
var newUp = require('./helpers/newUp');

var config={component: 'test', env: 'dev', app: 'testapp',isNode:true,silent:false};



describe('goal logging nowtl492',function(){

  //constructor call goals with properties


  it('should return results',function(){

    var logger=m(config);
    var log=logger.goal("test",{a:1})
    log.log("hello",{a:1});
    log.log("hello",{a:1});
    log.log("hello",{a:1});
    log.result("SuccessString")//expect logger to show history

  });

  it('should return results',function(){

    var logger=m(config);
    var log=logger.goal("test",{a:1})
    log.log("hello");
    log.log("hello");
    log.log("hello");
    log.fail("errorString")
      .catch(_.noop)
  })
});