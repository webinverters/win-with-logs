//var winWithLogs = require('./index');
//
//var exec = require('../../../test/helpers/exec');
//var newUp = require('../../../test/helpers/newUp');
//
//
//describe('constructor', function () {
//  beforeEach(function (done) {
//    exec("rm -rf testing2;mkdir testing2")
//      .then(function () {
//        done()
//      })
//  });
//  afterEach(function (done) {
//    exec("rm -rf testing2")
//      .then(function () {
//        done()
//      })
//  });
//
//  describe('valid calls', function () {
//    var calls = [
//      {
//        args: [{
//          app: "test",
//          env: "dev",
//          component: "testComponents"
//        }],
//        name: "basic"
//      },
//      {
//        args: [{
//          app: "test",
//          env: "dev",
//          component: "testComponents",
//          logFilePath: './testing2/',
//          maxLogFileSize: 100000,
//          maxLogFiles: 5
//        }],
//        name: "basic+fileconfig"
//      }
//    ];
//    _.forEach(calls, function (test) {
//      it('does not throw an error when called with the following arguments' + test.name, function () {
//        expect(function () {
//          newUp(winWithLogs, test.args)
//        }).to.not.throw();
//      })
//    })
//  });
//  describe('invalid calls', function () {
//
//    var calls = [
//      {args: [{}], name: "empty parameter", error: "options.name (string) is required"},
//      {args: [{app: "test"}], name: "empty parameter", error: "invalid param"},
//      {args: [{env: "dev"}], name: "empty parameter", error: "invalid param"},
//      {args: [{app: "test"}], name: "empty parameter", error: "invalid param"}
//    ];
//
//
//    _.forEach(calls, function (test) {
//      it('does not throw an error when called with the following arguments ' + test.name, function () {
//        expect(function () {
//          newUp(winWithLogs, test.args)
//        }).to.throw(test.error);
//      })
//    })
//
//
//  })
//
//});
