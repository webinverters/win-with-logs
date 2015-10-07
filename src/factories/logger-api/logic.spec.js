var logger = require('./index.js');
var log = require('../../data-structures').log_args;
var context = require('../../data-structures').context;
var transports = require('../../data-structures').transports;

describe('logger.js', function () {
  var bunyan;

  beforeEach(function () {
    bunyan = {log: sinon.stub().resolves({v: 1})}
  });
  it("it doesn't throw an error when called validly", function (done) {
    var temp = new logger(bunyan, new context([]), new transports([]))
    return temp.log("hi")
      .then(function () {
        var newtemp = temp.context("hello")
        newtemp.log("hi")
      })
      .then(function () {
        expect(bunyan.log.callCount).to.equal(2)
        expect(bunyan.log).to.have.been.calledWith("hi")
        done()
      })

  });
  it('logger.log will call bunyan log ')
  it('logger.debug will call bunyan log')
  it('logger.error will call bunyan log')
  it('logger.fatal will call bunyan log')
  it('logger.warn will call bunyan log')
  it('logger.addtransport will add different logging functions to be called.', function (done) {

    var func = sinon.stub().resolves("true");
    var m = new logger(bunyan, new context([]), new transports([]));

    m.addTransport(func)
    m.log("hi")
      .then(function () {
        expect(func.callCount).to.equal(1);
        expect(func).to.have.been.calledWith(JSON.stringify({v: 1}));
        done();
      })
  })
});