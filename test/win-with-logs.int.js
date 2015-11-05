var ModuleUnderTest = require('../index')
var TestStream = require('./helpers/test-stream')
var exec = require('./helpers/exec')
var fsTest = require('./helpers/checkFile')

describe('win-with-logs', function() {
  var log, mConfig

  var streams = {
    logStream: function(line) {
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

  describe('handle circular object logging', function() {
    it('does not throw exception when logging circular object', function() {
      var circle = {
        name: 'awesome'
      }
      circle.brother = circle

      expect(function() { log('Circle', circle) }).to.not.throw()
    })
  })

  describe('Error Reporting', function() {
    describe('log.errorReport()', function() {
      it('returns an error report object', function() {
        var er = log.errorReport('SOME_ERROR', {param1: 'einstein'})
        expect(er.what).to.equal('SOME_ERROR')
        expect(er.details).to.deep.equal({
          param1: "einstein"
        })
        expect(er.history).to.deep.equal([])
        expect(er.rootCause).to.equal('SOME_ERROR')
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
              "rootCause": "bad news"
            },
            {
              "what": "FIRST_ERROR",
              "details": {
                "param": "bad param",
                "isBad": false,
                "paramC": "no idea again"
              },
              "rootCause": "bad news"
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

    describe('throw an errorReport', function() {
      it('logs the rootCause error', function() {
        var goal = log.goal('logTheRootCauseError')
        return p.resolve()
          .then(function() {
            throw log.errorReport('ROOT_CAUSE_ERROR_123')
          })
          .catch(goal.fail)
          .catch(function() {
            expect(streams.logStream.lastLine).to.contain('ROOT_CAUSE_ERROR_123')
          })
      })

      it('logs the rootCause error variation #2', function() {
        var goal = log.goal('logTheRootCauseError')
        return p.resolve()
          .then(function() {
            throw log.errorReport('Here is a message', null, new Error('Root Error Cause'))
          })
          .catch(goal.fail)
          .catch(function(err) {
            expect(err.rootCause).to.equal('Root Error Cause')
            expect(streams.logStream.lastLine).to.contain('Root Error Cause')
          })
      })
    })

    describe('throw a string', function() {
      it('logs the rootCause error', function() {
        var goal = log.goal('logTheRootCauseError2')
        return p.resolve()
          .then(function() {
            throw 'ROOT_CAUSE_ERROR_123'
          })
          .catch(goal.fail)
          .catch(function() {
            expect(streams.logStream.lastLine).to.contain('ROOT_CAUSE_ERROR_123')
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

  describe('Event Handling', function() {
    describe('log.addEventHandler()', function() {
      var handler, handler2, handler3
      beforeEach(function() {
        handler = sinon.spy(), handler2 = sinon.spy(), handler3 = sinon.spy()
        log.addEventHandler("Le Event", handler);
        log.addEventHandler("Le Event", handler2);

        log.addEventHandler("Other", handler3)
      })

      it('calls all event handlers for a given event.',function() {
        return log('Le Event')
          .then(function() {
            expect(handler).to.have.been.deep.calledWith({eventName: 'Le Event', handled: false})
            expect(handler2).to.have.been.deep.calledWith({eventName: 'Le Event', handled: false})
            expect(handler3).to.not.have.been.called
            return log('Other')
          })
          .then(function() {
            expect(handler3).to.have.been.deep.calledWith({eventName: 'Other', handled: false})
          })
      })

      it('calls handlers with details as arguments', function() {
        return log('Le Event', {info: 'some info'})
          .then(function() {
            expect(handler).to.have.been.deep.calledWith({eventName: 'Le Event', handled: false},
                {info: 'some info'})
            expect(handler2).to.have.been.deep.calledWith({eventName: 'Le Event', handled: false},
                {info: 'some info'})

            expect(handler3).to.not.have.been.called
          })
      })

      describe('event.handled is set to true by a handler in the chain', function() {
        var handler, handler2, handler3
        beforeEach(function() {
          handler = sinon.spy(function(event) {
            event.handled = true
          }), handler2 = sinon.spy()
          log.addEventHandler("Le Event", handler);
          log.addEventHandler("Le Event", handler2);
        })

        it('does not call other event handlers in the chain.', function() {
          return log('Le Event')
            .then(function() {
              expect(handler).to.have.been.deep.called
              expect(handler2).to.not.have.been.called
            })
        })
      })

      describe('context.addEventHandler()', function() {
        describe('events subscribed on base and child loggers', function() {
          var handler, handler2, child
          beforeEach(function() {
            handler = sinon.spy(), handler2 = sinon.spy()
            log.addEventHandler("Le Event", handler)
            log.addEventHandler('Child Event', handler)

            child = log.goal('child')
            child.addEventHandler("Child Event", handler2)
          })
          it('does not trigger events subscribed on child logger', function() {
            return log('Child Event')
              .then(function() {
                expect(handler2).not.to.have.been.called
              })
          })
          it('bubbles events that dont exist on child to base logger', function() {
            return child('Le Event', {info: 'data'})
              .then(function() {
                expect(handler).to.have.been.deep.calledWith({
                  eventName: 'Le Event', handled: false
                },{info: 'data'})
              })
          })
          it('child can trigger events on child logger', function() {
            return child('Child Event', {info: 'data'})
              .then(function() {
                expect(handler2).to.have.been.deep.calledWith({
                  eventName: 'Child Event', handled: false
                },{info: 'data'})
              })
          })
          it('does not bubble to base logger', function() {
            return child('Child Event', {info: 'data'})
              .then(function() {
                expect(handler).to.not.have.been.called
              })
          })
        })
      })
    })
  })

  xdescribe('Log Querying', function() {})
})
