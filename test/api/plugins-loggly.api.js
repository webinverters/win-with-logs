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
          user: process.env.LOGGING_USER,
          password: process.env.LOGGING_PW,
          baseURL: 'https://webinverters.loggly.com/apiv2/'
        }
      }
    })
  })

  describe('log.info', function() {
    this.timeout(120000)
    it('event is queryable.', function() {
      var logString = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
          })

      log.info(logString, {
        somethingId: 1,
        description: 'xyz123',
        tag: 'AWESOME_MEASUREMENT',
        measurement: Math.round(Math.random()*100)
      })

      return p.delay(15000).then(function() {
          return log.query('json.msg:'+logString, {})
            .then(function(result) {
              debug('RESULT=', result)
              expect(result.length).to.equal(1)
              expect(result[0].event.json.details.somethingId).to.equal(1)
            })
        })
    })
  })
})
