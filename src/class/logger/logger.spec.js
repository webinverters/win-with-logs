var loggerApi = require('./index');

var logMessageType = require('../../data-types/log-message-type');
var transportType = require('../../data-types/transport-type');
var contextType = require('../../data-types/context-type');



describe('logger', function () {
  xit('world', function () {
    var bunyan = {};
    var log = new loggerApi(bunyan);

    log.logEntry();
    log.addContext("test", "test")
    log.addTransport(function(){},"log","log")

  });

  xit('it returns a promise', function (done) {
    var bunyan = {};
    var log = new loggerApi(bunyan);
    log.logEntry("hi")
      .then(function (result) {
        expect(result).to.equal(true);
        done()
      })
  })



  describe('implementation',function(){
    var bunyan;
    beforeEach(function(){
      bunyan={
        log:sinon.stub().resolves("logData")
      }
    })
    it('calls bunyan',function(done){
      var func={func:function(){
      }}
      sinon.spy(func,"func");

      var log = new loggerApi(bunyan);
      log.addTransport(func.func,"log","debug");
      log.addTransport(func.func,"log","debug");
      log.addTransport(func.func,"log","debug");

      var message=new logMessageType("123123123123",{},1,2,3,4,5,6)
      log.logEntry(message,"debug")
        .then(function(){
          expect(bunyan.log).to.have.been.called;
          expect(func.func).to.have.been.called;
          done();
        })
    })
    it('throws an error',function(){
      expect(function(){
        new loggerApi()
      }).to.throw("invalid bunyan")
    })
    it('can new itself up',function(){
      function test(){
      var bunyan={};
      var m=new loggerApi(bunyan);
      var n=new loggerApi(m);
      }
      expect(test()).to.not.throw

    })

  })


});