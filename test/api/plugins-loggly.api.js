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
  })
})
