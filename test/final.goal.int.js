var m = require('../src/api/final-api');
var newUp = require('./helpers/newUp');

var config={component: 'test', env: 'dev', app: 'testapp',isNode:true,silent:false,debug:false};



describe('goal logging nowtl492',function(){

  //constructor call goals with properties


  it('should return results',function(){

    var logger=m(config);
    var log=logger.goal("test",{a:1})
    log.log("hello",{a:1});
    log.log("hello",{a:2});
    log.log("hello",{a:3});
    log.result("SuccessString")//expect logger to show history

  });

  it('should return results',function(){

    var logger=m(config);
    var log=logger.goal("test",{a:1})
    log.log("hello",{a:1});
    log.log("hello",{a:2});
    log.log("hello",{a:3});
    log.fail("errorString")
      .catch(_.noop)
  })


});


//var goal = require('./index');
//
//
//describe('goal', function () {
//  var clock;
//  var goalName = "test";
//  beforeEach(function () {
//    clock = sinon.useFakeTimers();
//  });
//  afterEach(function () {
//    clock.restore();
//  });
//  it('logs the time to goal completion', function () {
//    var m = new goal(goalName);
//
//    clock.tick(1000);
//    m.addEntry("one");
//    clock.tick(1000);
//    m.addEntry("two");
//
//    expect(m.report()).to.deep.equal({
//      goal: 'test',
//      duration: 2000,
//      history: [{log: 'one', time: 1000}, {log: 'two', time: 2000}]
//    })
//  })
//});