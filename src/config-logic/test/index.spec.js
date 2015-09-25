var m=require('../index')
proxyquire = require('proxyquire').noPreserveCache();//can't use in config?

describe('configLogic',function(){
  var config;
  beforeEach(function(){
    config={};
    config.env="dev";
    config.app="test"
    config.component="testComponent"
  });


  it('disables cloud support by default',function(){
    expect(m(config)).to.containSubset({
      cloudEnabled:false
    })
  });
  it('enables console by default',function(){
    expect(m(config)).to.containSubset({
      consoleEnabled:true
    })
  });
  describe('mandatory properties',function(){
    describe('when missing parameters',function(){
      it('throws an error', function () {
        var config = {app: "test", component: "testComponet"};
        return expect(m.bind(null, config)).to.throw("missing env property")
      });
      it('throws an error', function () {
        var config = {env: "test", component: "testComponet"};
        return expect(m.bind(null, config)).to.throw("missing app property")
      });
      it('throws an error', function () {
        var config = {env: "test", app: "test"};
        return expect(m.bind(null, config)).to.throw("missing component property")
      })
    })
  });
  describe('filesystem',function(){
    it('enables fs by default',function(){
      expect(m(config)).to.containSubset({
        fsEnabled:true
      })
    });
    it('disables fs when disabled in config',function(){
      config.disableFs=true;
      expect(m(config)).to.containSubset({
        fsEnabled:false
      })
    });
    describe('when in the browser', function () {
      it('it disables fs ', function () {
        var m = proxyquire(require.resolve('../index.js'), {'fs': false})
        expect(m(config)).to.containSubset({
          fsEnabled: false
        })

      })
    })

  });
  describe('cloudlogic',function(){
    beforeEach(function(){
      config.robustKey="123";
      config.cloudConfig={};
      config.cloudConfig.enabledTrackEvents =true;
      config.cloudConfig.trackedEventSendInterval=300;
      config.cloudConfig.enableLogStreaming =true;
      config.cloudConfig.logSendInterval =5000;
    });
    describe('missing mandatory properties',function(){
      it('it throws an error',function(){
        delete config.robustKey;
        return expect(m.bind(null, config)).to.throw("missing property config.robustKey")
      })
    })


  });


  describe('source logging',function(){

    it('source logging is disabled by default',function(){
      console.log(config)
      expect(m(config)).to.containSubset({
        stackTraceEnabled:false
      })
    })
    it('source logging is enabled via config ',function(){
      config.debug=true;
      expect(m(config)).to.containSubset({
        stackTraceEnabled:true
      })
    })
  });











});