

//var exec=require('child_process').execSync;
var exec=require('child_process').execSync || require('exec-sync');
var fsHelper=require('../test/helpers/checkFile');

var m = require('../index')
var config = {};
var log;

describe('win-with-logs ', function () {
  describe('does not throw an error when passed a valid config ', function () {
    it('basic config', function () {
      log = m({
        component: "webservice",
        env: "dev",
        app: "test-app"
      });
    });
    it('debug config', function () {
      log = m({
        component: "webservice",
        env: "dev",
        app: "test-app",
        debug:true
      });
    });
    it('fs config', function () {
      log = m({
        component: "webservice",
        env: "dev",
        app: "test-app",
        enableFSLogging:true,
        logFilePath:"./",
        EventFilePath:"./",
        errorFilePath:"./",
        maxLogFileSize:1000000,
        maxLogFiles:5
      });
    });
    it('cloud config',function(){
      log = m({
        component: "webservice",
        env: "dev",
        app: "test-app",
        enableFSLogging:false,
        robustKey:"stuff",
        cloudConfig:{
          enabledTrackEvents:true,
          trackedEventSendInterval:true,
          enableLogStreaming:true,
          logSendInterval:true
        }
      });
    })
  })
  describe('basic usage for logging errors',function(){
    beforeEach(function(){
      log=m({
        component: "webservice",
        env: "dev",
        app: "test-app"
      })

    });
    it('expose the following apis',function(){
      log("message");
      log("message",{json:"string"});
      log("message","message 2");

      log({details:"string"});
      log({details:"string"},"message");
      log({details:"string"},{details2:"Another string"})

      log.debug();
      log.warn();
      log.fatal();
      log.error(new Error("error"))//must be an error object?

    });
    it('supports chaining context',function(){
      log.context("a").context("test2").log("abc")
      log.context("a").context("test2").warn("abc")
      log.context("a").error("abc")
      log.context("a").context("test2").error("abc")
    })
    it('log.success logs and returns success',function(){
      return p.resolve("hi")
        .then(log.success)
        .then(function(result){
          expect(result).to.equal("hi")
        })
    })
    it('log.failure',function(done){
      var thrownError = new Error("error")
      function test() {
        throw thrownError
      }
      return p.resolve()
        .then(function () {
          return test()
        })
        .then(_.noop, log.failure)
        .catch(function (err) {
          expect(err).to.equal(thrownError)
          done()
        })
    })
  });
  describe('pubSub',function(){
    beforeEach(function(){
      log=m({
        component: "webservice",
        env: "dev",
        app: "test-app"
      })
    });
    it('runs custom function on events',function(){
      var test=false;
      log.addEventHandler("test",function(){
        test=true;
      })
      log("test")
      expect(test).to.equal(true)

    })
  })




  describe('log writes to a filesystem',function(){
    beforeEach(function(){
      exec("rm -rf testing;mkdir testing")
    });
    after(function(){
      exec("rm -rf testing")
    });
    it('logs to a file',function(){
      var basicConfig = {
        component:"webservice",
        env: "dev",
        app: "test-app",
        logFilePath: './testing/',
        maxLogFileSize: 100000
      };
      var log=m(basicConfig);

      return p.resolve()
        .then(function(){
          return log("hello world")
        })
        .then(function(){
          return log("hi")
        })
        .then(function(){
          expect(fsHelper.hasFile('./testing','log0.log')).to.equal(true,"log should have written a file")
          expect(fsHelper.containLines('./testing/log0.log',['hello world','hi'])).to.equal(true,"file does not contain log entries")
        })
    });

    it('logs rotate file when size is exceeded tzx',function(){
      var basicConfig = {
        component:"webservice",
        env: "dev",
        app: "test-app",
        logFilePath: './testing/',
        maxLogFileSize: 200
      };
      var log=m(basicConfig);

      return p.resolve()
        .then(function(){
          return log("hello world")
        })
        .then(function(){
          return log("hi")
        })
        .then(function(){
          expect(fsHelper.hasFile('./testing','log0.log')).to.equal(true,"log should have written a file");
          expect(fsHelper.hasFile('./testing','log1.log')).to.equal(true,"log should have written a file");
          expect(fsHelper.containLines('./testing/log0.log',['hello world'])).to.equal(true,"file does not contain log entries")
          expect(fsHelper.containLines('./testing/log1.log',['hi'])).to.equal(true,"file does not contain log entries")
        })
    })

  });

});


//config.component
//config.env
//config.app
//config.debug(boolean)
//config.disableFs
//config.cloud
//config.enableFSLogging(boolean)

//config.logFilePath (string)  [./log]
//config.eventFilePath (string) [./events]
//config.errorFilePath (string) [./errors]

//config.maxLogFileSize (number) [1024*1000]
//config.maxLogFiles (number) [5]


//config.robustKey (string)
//config.cloudConfig.enabledTrackEvents (boolean)
//config.cloudConfig.trackedEventSendInterval (number) [5000ms]
//config.cloudConfig.enableLogStreaming (boolean) [true]
//config.cloudConfig.logSendInterval (number) [5000ms]

//config.goalLogFilePath(string)