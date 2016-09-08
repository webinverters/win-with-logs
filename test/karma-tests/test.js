describe("win-with-logs", function () {
  this.timeout(30000)

  var _log;
  beforeEach(function() {
    angular.module('test-setup',['robust-logs'])
      .value('config', {
        app: "robust-logs",
        env: "test",
        component: "karma-tests",
        plugins: {
          loggly: {
            token: '' // TODO: insert your token here...
          }
        }
      })
  })
  beforeEach(module('robust-logs'));
  beforeEach(module('test-setup'))
  beforeEach(inject(function (_Log_) {
    _log = _Log_;
  }))

  it('should write to console.log', function () {
    sinon.spy(console, "log")
    _log("hello world!!!")
    expect(console.log.callCount).to.equal(1)
  })

  describe('loggly plugin', function() {
    it('should send to loggly', function() {
      this.timeout(30000)
      var logString = 'clientsays-' + Math.random().toString()

      _log.info(logString, {
        somethingId: 1,
        description: 'xyz123',
        tag: 'AWESOME_MEASUREMENT',
        measurement: Math.round(Math.random()*100)
      })

      return p.delay(20000).then(function() {
          return _log.query(logString, {})
            .then(function(result) {
              console.log('RESULT=', result)
              expect(result.length).to.equal(1)
              expect(result[0].event.json.details.somethingId).to.equal(1)
            })
        })
    })
  })
})
