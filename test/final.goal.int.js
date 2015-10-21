var m = require('../src/api/win-with-logs-api');
var newUp = require('./helpers/newUp');

var config = {component: 'test', env: 'dev', app: 'testapp', isNode: true, silent: false, debug: false};


describe('goal logging', function () {

  it('should return results', function () {

    var logger = m(config);
    var log = logger.goal("test", {a: 1})
    log.log("hello", {a: 1});
    log.log("hello", {a: 2});
    log.log("hello", {a: 3});
    log.result("SuccessString")//expect logger to show history

  });

  it('should return results', function () {

    var logger = m(config);
    var log = logger.goal("test", {a: 1})
    log.log("hello", {a: 1});
    log.log("hello", {a: 2});
    log.log("hello", {a: 3});
    log.fail("errorString")
      .catch(_.noop)
  })


});




var Goal = require('../src/api/win-with-logs-api/final-type').Goal;
describe('goal', function () {
  var clock;
  var goalName = "test";
  beforeEach(function () {
    clock = sinon.useFakeTimers();
  });
  afterEach(function () {
    clock.restore();
  });
  it('logs the time to goal completion', function () {
    var m = new Goal(goalName,{});

    clock.tick(1000);
    m.addEntry("one");
    clock.tick(1000);
    m.addEntry("two");

    expect(m.report()).to.containSubset({
      goal: 'test',
      duration: 2000,
      history: [{log: 'one', time: 1000}, {log: 'two', time: 2000}]
    })
  })
});