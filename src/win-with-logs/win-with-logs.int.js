//var winWithLogs = require('./index');
//
//var exec = require('../../test/helpers/exec')
//var fsTest = require('../../test/helpers/checkFile');
//var fs=require('fs')
//
//describe('win-with-logs', function () {
//  before(function () {
//    sinon.spy(console, "log")
//  });
//  beforeEach(function () {
//    console.log.reset();
//  });
//  after(function(){
//    return exec("rm -rf testing")
//  })
//  var config;
//  describe('when supplied a basic config', function () {
//
//    beforeEach(function () {
//      config = {
//        app: "test",
//        env: "dev",
//        component: "testComponents"
//      };
//    })
//    describe('it logs to the console when calling logger api', function () {
//
//      it('log() writes to the console', function (done) {
//        var log = winWithLogs(config);
//        return log.log("hi")
//          .then(function () {
//            expect(console.log.callCount).to.equal(1)
//            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
//            done()
//          })
//      });
//      it('debug() writes to the console.', function (done) {
//        var log = winWithLogs(config);
//        log.debug("hi")
//          .then(function () {
//            expect(console.log.callCount).to.equal(1)
//            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
//            done();
//          })
//      });
//      it('error() writes to the console.', function (done) {
//        var log = winWithLogs(config);
//        log.error("hi")
//          .then(function () {
//            expect(console.log.callCount).to.equal(1)
//            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
//            done()
//          })
//      });
//
//      it('warn() writes to the console.', function (done) {
//        var log = winWithLogs(config);
//        log.warn("hi")
//          .then(function () {
//            expect(console.log.callCount).to.equal(1)
//            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
//            done()
//          })
//      });
//
//      it('fatal() writes to the console.', function (done) {
//        var log = winWithLogs(config);
//        log.fatal("hi")
//          .then(function () {
//            expect(console.log.callCount).to.equal(1)
//            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
//            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
//            done();
//          })
//      });
//
//      it('log.failure() when logging an error it logs the stack trace with the stackaaa11', function (done) {
//        var log = winWithLogs(config);
//        var temp = new Error("failure");
//        log.failure(temp)
//          .then(function () {
//            expect(console.log).to.have.been.calledWith(sinon.match('file:'));
//            expect(console.log).to.have.been.calledWith(sinon.match('line:'));
//            expect(console.log).to.have.been.calledWith(sinon.match('func:'));
//            done()
//          })
//      });
//
//      it('log.success() returns the success value and logs it.', function (done) {
//        var log = winWithLogs(config);
//        log.success("test")
//          .then(function (result) {
//            expect(result).to.equal("test")
//            expect(console.log).to.have.been.calledWith(sinon.match('test'))
//            done()
//          })
//      });
//
//      describe('log.context aaz', function () {
//        it('logs all context.', function () {
//          var log = winWithLogs(config);
//          var ctx = log.context("new")
//          return ctx.log("hi")
//            .then(function () {
//              expect(console.log).to.have.been.calledWith(sinon.match('hi'))
//              expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
//              expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
//              expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
//            })
//        })
//      })
//
//
//    })
//    describe('goal tracking', function () {
//
//      it('when logging a goal, it logs the duration of a goal duration on complete', function (done) {
//        var log = winWithLogs(config);
//        var goal = log.goal('doStuff',
//          {user: "user", data: "data"},
//          {track: true, expireSecs: 0, retry: 'exponential', alert: 'backendFailure', alertOnlyIfRetryFails: true})
//
//        p.resolve(goal) // can optionally pass the goal around so other parts can log to the goal.
//          .then(function (goal) {
//            return goal.log('Finished doCrazyStuff()')
//          })
//          .then(function () {
//            return goal.completeGoal()
//          })
//          .then(function (result) {
//            expect(console.log.callCount).to.equal(2)
//            expect(console.log).to.have.been.calledWith(sinon.match('doStuff'))
//            expect(console.log).to.have.been.calledWith(sinon.match('duration'))
//            done();
//          });
//
//      })
//    })
//    describe('pub sub', function () {
//      describe('when adding a custom event handler', function () {
//        it('runs an custom function when a tracked event is passed in the logs.', function () {
//          console.log("remove me")
//
//        });
//      })
//    })
//    describe('tracked events', function () {
//
//    })
//  })
//
//  describe('when passed a cloud config', function () {
//    describe('regular api calls', function () {
//      it('whatever', function () {
//        console.log("remove me!!!!!")
//      })
//    })
//    describe('goal tracking', function () {
//      it('whatever', function () {
//        //remove me
//      })
//    })
//  });
//  describe('when passed an invalid config', function () {
//    it('throws various errors', function () {
//      //remove me
//    })
//  })
//});