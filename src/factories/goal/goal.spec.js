var goal = require('./index');


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
    var m = new goal(goalName);

    clock.tick(1000);
    m.addEntry("one");
    clock.tick(1000);
    m.addEntry("two");

    expect(m.report()).to.deep.equal({
      goal: 'test',
      duration: 2000,
      history: [{log: 'one', time: 1000}, {log: 'two', time: 2000}]
    })
  })
});