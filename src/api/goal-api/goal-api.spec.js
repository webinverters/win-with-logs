var goalApi = require('./index');
var transportType = require('../../data-types/transport-type')

var transport = new transportType;
transport.addTransport(function (a) {
  console.log(a.logString, a.args)
}, "log", "debug")


describe('goalApi ', function () {
  var bunyan
  beforeEach(function () {
  });
  it('happy path', function () {


    var bunyan = {log: sinon.stub().resolves({message: "logData"})};

    var m = new goalApi("goal", {}, {}, bunyan, transport)

    m.log("hi")
    m.warn("hello");
    m.debug("hi");
    m.fatal("hi?");
    m.error("it");
    //
    m.complete("success");
    m.fail("failure");

  })
})