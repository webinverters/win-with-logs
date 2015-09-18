proxyquire = require('proxyquire').noPreserveCache();//can't use in config?

var helpers={
  writeFile:sinon.stub().resolves(true),
  logEntry:sinon.stub().resolves(true)
}

function mockHelper(){
  return helpers
}

var m=proxyquire('../index',{"../log-entry":mockHelper});


describe('win-with-logs ', function () {
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
    var ctx=log.module("testModule")
    ctx.log("test1",{})
    expect(helpers.logEntry).to.have.been.calledWith("log","test1",{},{module:"testModule"})
  })
  it('method context',function(){
    var log=m()
    var ctx=log.method("testModule")
    ctx.log("test1",{})
    expect(helpers.logEntry).to.have.been.calledWith("log","test1",{},{method:"testModule"})
  })
  it('function context',function(){
    var log=m()
    var ctx=log.function("testModule")
    ctx.log("test1",{})
    expect(helpers.logEntry).to.have.been.calledWith("log","test1",{},{function:"testModule"})
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


})
