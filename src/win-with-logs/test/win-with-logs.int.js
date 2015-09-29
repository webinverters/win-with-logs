var winWithLogs = require('../index')

describe('win-with-logs', function () {
  describe('when supplied a basic config', function () {
    describe('it logs to the console when calling logger api', function () {
      var config;
      var consoleStub;

      before(function () {
        sinon.spy(console,"log")
      });
      beforeEach(function () {
        config = {
          app: "test",
          env: "dev",
          component: "testComponents"
        };
        //consoleStub = sinon.stub(console, "log", function () {});
      });

      afterEach(function () {
        //consoleStub.restore();
        console.log.reset()
      });

      it('log() writes to the console', function (done) {
        var log = winWithLogs(config);
        return log.log("hi")
          .then(function(){
            expect(console.log.callCount).to.equal(1)
            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
            done()
          })
      });
      it('debug() writes to the console.',function(done){
        var log = winWithLogs(config);
        log.debug("hi")
          .then(function(){
            expect(console.log.callCount).to.equal(1)
            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
            done();
          })
      });
      it('error() writes to the console.',function(done){
        var log = winWithLogs(config);
        log.error("hi")
          .then(function(){
            expect(console.log.callCount).to.equal(1)
            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
            done()
          })
      });

      it('warn() writes to the console.', function (done) {
        var log = winWithLogs(config);
        log.warn("hi")
          .then(function(){
            expect(console.log.callCount).to.equal(1)
            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
            done()
          })
      });

      it('fatal() writes to the console.',function(done){
        var log = winWithLogs(config);
         log.fatal("hi")
          .then(function(){
            expect(console.log.callCount).to.equal(1)
            expect(console.log).to.have.been.calledWith(sinon.match('hi'))
            expect(console.log).to.have.been.calledWith(sinon.match('"name":"test"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"env":"dev"'))
            expect(console.log).to.have.been.calledWith(sinon.match('"component":"testComponents"'))
            done();
          })
      });

      it('log.failure() when logging an error it logs the stack trace with the stack',function(){
        var log=winWithLogs(config);
      });

      it('log.success() returns the success value and logs it.')

      describe('log.context',function(){
        it('logs all context.')
      })





    })
    describe('goal tracking',function(){
      it('when logging a goal, it logs the duration of a goal duration',function(){

      })
    })
    describe('pub sub',function(){
      describe('when adding a custom event handler',function(){
        it('runs an custom function when a tracked event is passed in the logs.');
      })
    })
    describe('tracked events',function(){

    })
  })
  describe('when passed a filesystem config',function(){
    describe('regular api calls',function(){

    });
    describe('when exceeding file size',function(){
      it('creates a new log file')
    });
    describe('when exceeding max file count',function(){
      it('delete old files')
    })
  });
  describe('when passed a cloud config',function(){
    describe('regular api calls',function(){})
    describe('goal tracking',function(){})
  });
  describe('when passed an invalid config',function(){
    it('throws various errors')
  })
});