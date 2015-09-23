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