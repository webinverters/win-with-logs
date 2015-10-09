var loggerApi = require('./index');
var transportType = require('../../data-types/transport-type');


describe('loggerApi', function () {
  xit('world', function () {
    var bunyan = {};

    var log = new loggerApi(bunyan);

    log.log();
    log.warn();
    log.debug();
    log.error();
    log.fatal();
    var ctx = log.context()
    ctx.log();
    ctx.warn();
    ctx.debug();
    ctx.error();
    ctx.fatal();
  })

  it('world2', function () {
    var bunyan = {log: sinon.stub().returns("logData")};
    var m = new transportType;
    m.addTransport(function () {}, "log", "debug");

    var log = new loggerApi(bunyan,m);

  })
})