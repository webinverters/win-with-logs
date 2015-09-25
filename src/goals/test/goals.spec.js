var m=require('../index')

describe('goal',function(){
  var clock;
  before(function(){
    clock = sinon.useFakeTimers(1000000);
  });
  after(function(){
    clock.restore();
  });
  it('returns the duration of the goal and a breakdown of log entries',function(){

    var goal=m('testGoal');
    clock.tick(1000);
    goal.addEntry("one");
    clock.tick(1000);
    goal.addEntry("two");
    clock.tick(1000);
    goal.addEntry("three");

    expect(goal.returnStatus("success")).to.deep.equal({
      goal:"testGoal",
      duration:3000,
      history:[
        {log:"one",time:1000},
        {log:"two",time:2000},
        {log:"three",time:3000}
      ]
    })
  })
});