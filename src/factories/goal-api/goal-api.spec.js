var logger = require('./index.js');
var log = require('../../data-structures').log_args;
var context = require('../../data-structures').context;
var transports = require('../../data-structures').transports;
var bunyan = {log: sinon.stub().resolves("true")}

var goalApi = require('./index');

xdescribe('goalApi', function () {
  var clock;
  beforeEach(function () {
    clock = sinon.useFakeTimers();
  })
  afterEach(function () {
    clock.restore();
  })
  it('it contains logging ', function () {


    var m = new goalApi("goalName", bunyan, new context([]), new transports([]));
    expect(m.log).to.be.a("function");
    expect(m.error).to.be.a("function");
    expect(m.debug).to.be.a("function");
    expect(m.warn).to.be.a("function");
    expect(m.fatal).to.be.a("function");
    m.log("hi")
    expect(bunyan.log).to.have.been.calledWith(sinon.match.any, sinon.match({goal: "goalName"}))


    //var result = {
    //  goal: 'goalName',
    //  duration: 0,
    //  history: [{log: 'hi', time: 0}]
    //};
    //
    //expect(m.completeGoal()).to.deep.equal(result)
  })
})