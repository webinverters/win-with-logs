/**
* @Author: Robustly.io <Auto>
* @Date:   2016-03-18T00:21:34-04:00
* @Email:  m0ser@robustly.io
* @Last modified by:   Auto
* @Last modified time: 2016-03-18T00:21:36-04:00
* @License: Apache-2.0
*/



var randomstring = require("randomstring");

describe('loggly integration', function() {
  var log
  before(function() {
    log = require('../../index')({
      app: 'robust-logs',
      env: 'test',
      name: 'api-tests',
      plugins: {
        loggly: {
          token: process.env.LOGGING_TOKEN,
          bufferSize: 5
        }
      }
    })
  })

  describe('log()', function() {
    // MANUAL EXPECT: manually check that 6 events in total were sent
    // since the bufferSize is set to 5 in the config above.
    it('buffers non errors until an error happens', function() {
      var logString = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
          })

      _.each(_.range(10), function(i) {
        log('TEST', {val: i})
      })

      return log.error('FAILURE_OCCURRED')
        .delay(15000)
        .then(function() {
          log('RESULT:', arguments)
        })
    })

    // MANUAL EXPECT: ensure WARN_TEST was sent to loggly, but not LOG_WARN
    it('pushes warnings (and doesnt empty buffer)', function() {
      log('LOG_WARN')
      return log.warn('WARN_TEST')
        .delay(15000)
        .then(function() {
          log('RESULT:', arguments)
        })
    })

    // MANUAL EXPECT: search by tag:TEST_CALL to check this event appears.
    it('pushes tags correctly', function() {
      return log.warn('TAG_TEST', {temperature: 5}, {tags: 'TEST_CALL'})
        .delay(15000)
        .then(function() {
          log('RESULT:', arguments)
        })
    })

    it('errors include stacktrace details', function() {
      return p.try(function() {
        throw new Error('System Failure Test.')
      })
      .catch(function(err) {
        return log.error('A_TEST_FAILURE', err)
      })
      .delay(15000)
      .then(function() {
        log('Completed...')
      })
    })
  })

  // describe('@temp', function() {
  //   it('makes events', function() {
  //     return p.map(_.range(100), function() {
  //       return log.warn('TEST_GOAL_COMPLETED', {duration: Math.floor((Math.random() * 100) + 1)})
  //         .delay(300)
  //     }, {concurrency: 1})
  //   })
  // })

  describe('log.goal()', function() {
    function testGoal(err) {
      var goal = log.goal('testGoal()', arguments)
      return p.resolve()
        .then(function() {
          if (err) throw new Error('ErrorCode: 54')
          return 'completed successfully'
        })
        .then(goal.pass)
        .catch(goal.fail)
    }
    it('when goals fail they send details to loggly', function() {
      return testGoal(true)
        .catch(function(err) {
          console.log('CheckError', err.errorCode)
        })
        .delay(5000)
    })
    it('sends goal completions to loggy', function() {
      return testGoal()
        .delay(5000)
    })
  })
})
