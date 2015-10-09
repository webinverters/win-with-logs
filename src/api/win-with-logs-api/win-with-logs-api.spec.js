//var winWithLogs_api = require('./index');
//
//
//describe('winWithLogs_api', function () {
//  var bunyan;
//  before(function () {
//    bunyan = {
//      log: function (a) {
//        return {message: "logData"}
//      }
//    }
//    sinon.spy(bunyan, "log");
//  });
//  beforeEach(function () {
//    bunyan.log.reset()
//  });
//
//  it('it can log entries', function () {
//    var m = new winWithLogs_api(bunyan);
//    m.log("hi?");
//    m.warn("hi");
//    m.error("hi");
//    m.debug("hi");
//    m.fatal("hi");
//  })
//
//  it('it can do context',function(){
//    var m = new winWithLogs_api(bunyan);
//    m.log("hi?");
//    var t=m.context("abc");
//    var tt=m.function("abc");
//    var ttt=m.module("abc");
//    var tttt=m.method("abc");
//  })
//  //it('it can log goals',function(){
//  //
//  //})
//
//
//
//});