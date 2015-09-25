proxyquire = require('proxyquire').noPreserveCache();//can't use in config?

var helpers={
  writeFile:sinon.stub().resolves(true),
  logEntry:sinon.stub().resolves(true)
}

function mockHelper(){
  return helpers
}

var m=proxyquire('../index',{"../log-entry":mockHelper});


xdescribe('win-with-logs ', function () {
  it('is a factory that provides the following object', function () {
    var config={
      component:"webservice",
      env:"dev",
      app:"test-app"
    }

    var temp=m(config)
    expect(temp).to.be.a('function')

    expect(temp).to.have.property('module').is.a('function')
    expect(temp).to.have.property('result').is.a('function')
    expect(temp).to.have.property('rejectWithCode').is.a('function')
    expect(temp).to.have.property('debug').is.a('function')
    expect(temp).to.have.property('warn').is.a('function')
    expect(temp).to.have.property('error').is.a('function')
    expect(temp).to.have.property('fatal').is.a('function')
    expect(temp).to.have.property('addEventHandler').is.a('function')
    expect(temp).to.have.property('queryEvents').is.a('function')
    expect(temp).to.have.property('getLogs').is.a('function')
    expect(temp).to.have.property('goal').is.a('function')
    expect(temp).to.have.property('failedGoal').is.a('function')
    expect(temp).to.have.property('completedGoals').is.a('function')
  })
})



describe('basic usage',function(){
  beforeEach(function(){
    helpers.logEntry.reset()
  })
  it('log',function(){
    var log=m()
    log("test",{})
    expect(helpers.logEntry).to.have.been.calledWith("log","test",{})
  })
  it('log.warn',function(){
    var log=m()
    log.warn("test",{})
    expect(helpers.logEntry).to.have.been.calledWith("warn","test",{})
  })
  it('log.error',function(){
    var log=m()
    log.error("test",{})
    expect(helpers.logEntry).to.have.been.calledWith("error","test",{})
  })
  it('log.fatal',function(){
    var log=m()
    log.fatal("test",{})
    expect(helpers.logEntry).to.have.been.calledWith("fatal","test",{})
  })
  it('log.debug',function(){
    var log=m()
    log.debug("test",{})
    expect(helpers.logEntry).to.have.been.calledWith("debug","test",{})
  })
})

describe('context usage',function(){
  beforeEach(function(){
    helpers.logEntry.reset()
  })
  it('module context',function(){
  var log=m()
    var ctx=log.context("testModule")
    ctx.log("test1",{})
    expect(helpers.logEntry).to.have.been.calledWith("log","test1",{},"testModule")
  })
  it('module context',function(){
    var log=m()
    var ctx=log.context("testModule").context("1")
    ctx.log("test1",{})
    expect(helpers.logEntry).to.have.been.calledWith("log","test1",{},"testModule-1")
  })



})



describe('documentation tests',function(){
  it('basic usage',function(){
    var config = {
      component: 'webservice',
      env: 'dev',
      app: 'test-app'
    }
    var log = m(config)
    log("hello world",{})//by default logs to the console.
    log.warn("hello world",{})
    log.debug("hello world",{})
    log.warn("hello world",{})
    log.error("hello world",{})
    log.fatal("error",{})
  })
  it('filesave usage',function(){
    var config = {
      component: 'webservice',
      env: 'dev',
      app: 'test-app',
      eventLogFilePath: '.'
    }
    var log = m(config)
    log("hello world",{})//saves to console and filesystem.
  })

  it('config', function () {

  })

  describe('goal logging',function(){
    it("doesn't throw an error",function(done){
      config.env="dev";
      config.app="test"
      config.component="testComponent"
      var log=m(config)
      function doCrazyStuff(){return p.resolve();}
      function doStuff(user, data) {

        var goal = log.goal('doStuff',
          {user: user, data:data},
          {track:true,expireSecs:0,retry:'exponential',alert:'backendFailure',alertOnlyIfRetryFails: true})

        return doCrazyStuff(goal) // can optionally pass the goal around so other parts can log to the goal.
          .then(function() {
            goal.log('Finished doCrazyStuff()')
            console.log("here?",goal.complete)
            return 2
          })
          .then(goal.complete)
          .catch(goal.fail)
      }
      return doStuff("user","data")
        .then(function(a){console.log("here");done();})
    })
  })


})
