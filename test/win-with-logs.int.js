var ModuleUnderTest = require('../index')
var TestStream = require('./helpers/test-stream')
var exec = require('./helpers/exec')
var fsTest = require('./helpers/checkFile')

describe('win-with-logs', function() {
  var log, mConfig

  var streams = {
    logStream: function(line) {
      //var fs = require('fs')
      //fs.writeFileSync('logstream', line)
      console.log(line)
      streams.logStream.lastLine = line
    }
  }

  beforeEach(function() {
    var logStream = TestStream(config, function(chunk,enc,done) {
      streams.logStream(chunk)
    })

    mConfig = {
      app: 'win-with-logs',
      component: 'int-test',
      env: 'test',
      debug: true,
      logStream: logStream
    }

    log = ModuleUnderTest(mConfig)
  })

  describe('Console Logging', function() {
    describe('debug level', function() {
      it('outputs correctly', function() {
        log.debug('something happened')
        expect(streams.logStream.lastLine).to.contain('DEBUG')
        expect(streams.logStream.lastLine).to.contain('(app=win-with-logs, part=int-test, env=test')
        expect(streams.logStream.lastLine).to.contain('something happened')
      })
    })
    describe('info level', function() {
      it('outputs correctly', function() {
        log.info('something happened')
        expect(streams.logStream.lastLine).to.contain('INFO')
        expect(streams.logStream.lastLine).to.contain('(app=win-with-logs, part=int-test, env=test')
        expect(streams.logStream.lastLine).to.contain('something happened')
      })
    })
    describe('info level (log)', function() {
      it('outputs correctly', function() {
        log('something happened')
        expect(streams.logStream.lastLine).to.contain('INFO')
        expect(streams.logStream.lastLine).to.contain('(app=win-with-logs, part=int-test, env=test')
        expect(streams.logStream.lastLine).to.contain('something happened')
      })
    })
    describe('fatal level', function() {
      it('outputs correctly', function() {
        log.fatal('something happened')
        expect(streams.logStream.lastLine).to.contain('FATAL')
        expect(streams.logStream.lastLine).to.contain('(app=win-with-logs, part=int-test, env=test')
        expect(streams.logStream.lastLine).to.contain('something happened')
      })
    })
    describe('warn level', function() {
      it('outputs correctly', function() {
        log.warn('something happened')
        expect(streams.logStream.lastLine).to.contain('WARN')
        expect(streams.logStream.lastLine).to.contain('(app=win-with-logs, part=int-test, env=test')
        expect(streams.logStream.lastLine).to.contain('something happened')
      })
    })
    describe('error level', function() {
      it('outputs correctly', function() {
        log.error('something happened')
        expect(streams.logStream.lastLine).to.contain('ERROR')
        expect(streams.logStream.lastLine).to.contain('(app=win-with-logs, part=int-test, env=test')
        expect(streams.logStream.lastLine).to.contain('something happened')
      })
      it('outputs error objects correctly with stack trace.', function() {
        log.error('Error happened', new Error('something bad happened'))
        expect(streams.logStream.lastLine).to.contain('Error: something bad happened')
        // check stack trace is present as well:
        expect(streams.logStream.lastLine).to.contain('at Context.<anonymous>')
      })
      it('outputs detail objects correctly with stack trace.', function() {
        log.error('Error happened', {
          param: 'some param',
          err: new Error('something bad happened')
        })

        expect(streams.logStream.lastLine).to.contain('details: {')
        expect(streams.logStream.lastLine).to.contain('"param": "some param"')
        expect(streams.logStream.lastLine).to.contain('Error: something bad happened')
        // check stack trace is present as well:
        expect(streams.logStream.lastLine).to.contain('at Context.<anonymous>')
      })
    })
  })

  describe('Error Reporting', function() {
    describe('log.errorReport()', function() {
      it('returns an error report object', function() {
        expect(log.errorReport('SOME_ERROR', {param1: 'einstein'}))
          .to.deep.equal({
            what: 'SOME_ERROR',
            details: {
              param1: "einstein"
            },
            history: [],
            rootCause: 'SOME_ERROR'
          })
      })

      describe('multiple error reports are thrown', function() {
        var errorReport;
        beforeEach(function() {
          var rootError = log.errorReport('ROOT_ERROR', {
            param: 'bad param',
            isBad: true
          }, new Error('bad news'))

          var firstLevelError = log.errorReport('FIRST_ERROR', {
            paramC: 'no idea',
            isBad: false
          }, rootError)

          var secondLevelError = log.errorReport('SECOND_ERROR', {
            paramC: 'no idea again'
          }, firstLevelError)

          errorReport = secondLevelError
        })

        it('overwrites details with latest error', function() {
          expect(errorReport.details.isBad).to.equal(false)
          expect(errorReport.details.paramC).to.equal('no idea again')
        })

        it('logs the root error correctly', function() {
          log('Error Report', errorReport)
          expect(streams.logStream.lastLine).to.contain('Error: bad news')
          expect(streams.logStream.lastLine).to.contain('details: {')
          expect(streams.logStream.lastLine).to.contain('"what": "SECOND_ERROR"')
        })

        it('keeps flattened report history', function() {
          expect(errorReport.history).to.deep.equal([
            {
              "what": "ROOT_ERROR",
              "details": {
                "param": "bad param",
                "isBad": false,
                "paramC": "no idea"
              },
              "rootCause": "bad news",
              "err": {}
            },
            {
              "what": "FIRST_ERROR",
              "details": {
                "param": "bad param",
                "isBad": false,
                "paramC": "no idea again"
              },
              "rootCause": "bad news",
              "err": {}
            }
          ])
        })

        it('sets the correct rootCause', function() {
          expect(errorReport.rootCause).to.equal('bad news')
        })

        it('stickies the details and bubbles them up.', function() {
          expect(errorReport.details).to.deep.equal({
            "param": "bad param",
            "isBad": false,
            "paramC": "no idea again"
          })
        })
      })
    })
  })


  function verifyGoalTrackingWorks(contextType) {
    describe('log.'+contextType+'()', function() {
      var goal;
      beforeEach(function() {
        goal = log[contextType]('makeTestsAwesome()', {param1: 'awesome'})
      })

      describe('log.failSupressed()', function() {
        it('does not throw errors', function () {
          expect(function () {
            return p.resolve()
              .then(throwEx)
              .catch(log.failSuppressed)
            }).to.not.throw()
        })

        it('logs the error', function() {
          goal.failSuppressed(new Error('network died'))
          expect(streams.logStream.lastLine).to.contain('FAILED_MAKE_TESTS_AWESOME')
          expect(streams.logStream.lastLine).to.contain('Error: network died')
        })

        it('logs the goal report', function() {
          goal.failSuppressed(new Error('network died'))
          expect(streams.logStream.lastLine).to.contain('"goalReport": {')
          expect(streams.logStream.lastLine).to.contain('"goalName": "makeTestsAwesome()",')
        })

        it('sets the goal report to status failed.', function() {
          goal.failSuppressed(new Error('network died'))
          expect(streams.logStream.lastLine).to.contain('"status": "failed"')
        })
      })

      describe('goal.log', function() {
        it('logs to logStream', function() {
          goal.log('This happened', {name: 'wwl'})
          expect(streams.logStream.lastLine).to.contain('INFO')
          expect(streams.logStream.lastLine).to.contain('"name": "wwl"')
        })
        it('appends log entries to the current goal history', function() {
          goal.log('This happened', {name: 'wwl'})
          goal.log('Achieved this')
          goal.failSuppressed(new Error('network died'))
          expect(streams.logStream.lastLine).to.contain('"msg": "This happened"')
          expect(streams.logStream.lastLine).to.contain('"msg": "Achieved this"')
        })
      })

      describe('goal.result()', function() {
        it('logs the goal report', function() {
          goal.result(10)
          expect(streams.logStream.lastLine).to.contain('"goalName": "makeTestsAwesome()"')
        })
        it('returns the same argument passed in', function() {
          expect(goal.result(10)).to.equal(10)
        })
      })

      describe('goal.fail()', function() {
        it('throws an error report', function() {
          return p.resolve('Something went wrong')
          .then(throwEx)
          .catch(goal.fail)
          .catch(function(err) {
            expect(err.what).to.equal('FAILED_MAKE_TESTS_AWESOME')
          })
        })
      })

      describe('goal.rejectWithCode()', function() {
        it('throws an error report', function() {
          return p.resolve('Something went wrong')
          .then(throwEx)
          .catch(goal.rejectWithCode('FAILED_CODE'))
          .catch(function(err) {
            expect(err.what).to.equal('FAILED_CODE')
          })
        })
      })
    })
  }

  describe('Goal Tracking', function() {
    verifyGoalTrackingWorks('method')
    verifyGoalTrackingWorks('goal')
    describe('Child goal reporting', function() {
      function subTask(goal) {
        var subGoal = goal.goal('doSubTask()', {subTaskParam: 'abc'})
        return p.resolve().delay(1000)
          .then(function() {
            subGoal.log('sub goal completed')
            return 'sub goal result'
          })
          .then(subGoal.result)
      }
      var goal;
      beforeEach(function() {
        goal = log.goal('makeGoalHappen()', {param1: 'awesome'})
      })

      it('Reports the subgoal as part of goalReport.history', function() {
        return subTask(goal)
          .then(goal.result)
          .then(function() {
            expect(streams.logStream.lastLine).to.contain('"childGoalReports": [')
            expect(streams.logStream.lastLine).to.contain('"goalName": "doSubTask()"')
          })
      })
    })
  })

  describe('File Logging',function() {
    var maxFileSize = 300
    beforeEach(function () {
      mConfig.logStreams = [
        {
          type: 'rotating-file-max',
          level: 'info', // info and higher will be logged to this file.
          logFileName: 'info.log',
          logFilePath: './testing/',
          maxLogFileSize: maxFileSize,
          maxLogFiles: 2
        }
      ]

      return exec("rm -rf testing;")
        .finally(function () {
          return exec("mkdir testing")
        })
        .then(function() {
          log = ModuleUnderTest(mConfig)
        })
    });
    // afterEach(function () {
    //   return exec("rm -rf testing")
    //
    // });
    // after(function () {
    //   return exec("rm -rf testing;")
    // });

    it('creates log file if it doesnt exist.', function () {
      return log("hi").then(function () {
        expect(fsTest.hasFile("./testing", "info.log")).to.equal(true)
        expect(fsTest.containLines('./testing/info.log', ["hi"])).to.equal(true, "log not written to file.")
      })
    });

    describe('multiple log calls', function() {
      var maxFileSize = 100000
      beforeEach(function () {
        mConfig.logStreams = [
          {
            type: 'rotating-file-max',
            level: 'info', // info and higher will be logged to this file.
            logFileName: 'multiple.log',
            logFilePath: './testing/',
            maxLogFileSize: maxFileSize,
            maxLogFiles: 5
          }
        ]

        return exec("rm -rf testing;")
          .finally(function () {
            return exec("mkdir testing")
          })
          .then(function() {
            log = ModuleUnderTest(mConfig)
          })
      });
      it('does not miss any log lines', function() {
        log('test1')
        log('test2')
        log('test3')
        log('test4')
        return p.delay(5000).then(function() {
          expect(fsTest.containLines('./testing/multiple.log', ["test1", "test2", "test3", "test4"]))
          .to.equal(true, "log lines are missing")
        })
      })
    })

    describe('when exceeding file size ', function () {
      it('creates a new log file', function () {
        return log.warn("hi")
          .then(function () {
            // this call will exceed the maxFileSize due to all the meta data
            return log.log("hello")
          })
          .then(function () {
            expect(fsTest.hasFile("./testing", "info.log")).to.equal(true)
            expect(fsTest.hasFile("./testing", "info1.log")).to.equal(true)
            expect(fsTest.containLines('./testing/info.log', ["hi"])).to.equal(true, "log should have been written to filesystem")
            expect(fsTest.containLines('./testing/info1.log', ["hello"])).to.equal(true, "log should have been written to filesystem")
          })
      })
    });

    describe('when exceeding max file count', function () {
      it('overwrites the first file in the rotation.', function () {
        return log.warn("hi")
          .then(function () {
            // this call will exceed the maxFileSize due to all the meta data
            return log.log("hello")
          })
          .then(function() {
            return log.log("xyz123")
          })
          .then(function () {
            expect(fsTest.hasFile("./testing", "info.log")).to.equal(true)
            expect(fsTest.hasFile("./testing", "info1.log")).to.equal(true)
            expect(fsTest.containLines('./testing/info.log', ["xyz123"])).to.equal(true, "log should have been written to filesystem")
            expect(fsTest.containLines('./testing/info1.log', ["hello"])).to.equal(true, "log should have been written to filesystem")
          })
      })

      it('overwrites the first file in the rotation (without waiting)', function () {
        log.warn("hi")
        log("hello")
        log("xyz123")
        log.debug('no effect since the logstream level is set to info') // this will have no effect on the test.
        return p.delay(3000)
          .then(function () {
            expect(fsTest.hasFile("./testing", "info.log")).to.equal(true)
            expect(fsTest.hasFile("./testing", "info1.log")).to.equal(true)
            expect(fsTest.containLines('./testing/info.log', ["xyz123"])).to.equal(true, "log should have been written to filesystem")
            expect(fsTest.containLines('./testing/info1.log', ["hello"])).to.equal(true, "log should have been written to filesystem")
          })
      })
    })
  })

  //
  // describe('Event Handling', function() {
  //   // it('pubSub',function() {
  //   //   var log = m(config);
  //   //   log.addEventHandler("test",function(){
  //   //     console.log("da event!!")
  //   //   });
  //   //   log.log("@test",{})
  //   //   log.warn("hello world?")
  //   // })
  // })
  //
  // describe('Child Contexts', function() {
  //   var log
  //   beforeEach(function() {
  //     var config={
  //       app: "abc", env: "aaa",
  //       component: "aaa",debug:false,
  //       silent:false,isNode:true
  //     }
  //
  //     log= m(config)
  //     log = log.module('test')  // sets up a new context.
  //   })
  //
  //   it('ctx.rejectWithCode logs context info', function(done) {
  //     return p.resolve()
  //       .then(throwEx)
  //       .catch(log.rejectWithCode("CODE"))
  //       .catch(function(err) {
  //         expect(err.what).to.equal("CODE")
  //         done()
  //       })
  //   })
  //
  //   it('ctx.result logs context info', function() {
  //     return p.resolve('result')
  //       .then(log.result)
  //       .then(function(result) {
  //         expect(result).to.equal('result')
  //       })
  //   })
  // })
  //
  // xdescribe('Log Querying')
})
