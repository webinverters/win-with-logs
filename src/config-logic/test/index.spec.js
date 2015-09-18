var m=require('../index')

describe('configLogic',function(){
  var config={};
  beforeEach(function(){
    config.env="dev";
    config.app="test"
    config.component="testComponent"
  });
  it('enables fs by default',function(){
    expect(m(config)).to.containSubset({
      fsEnabled:true
    })
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
    it('no env property',function(){
      var config={app:"test",component:"testComponet"};
      return expect(m.bind(null,config)).to.throw("missing env property")
    });
    it('no env property',function(){
      var config={env:"test",component:"testComponet"};
      return expect(m.bind(null,config)).to.throw("missing app property")
    });
    it('no component property',function(){
      var config={env:"test",app:"test"};
      return expect(m.bind(null,config)).to.throw("missing component property")
    })
  })
  describe('filesystem',function(){});
  describe('cloudlogic',function(){});
  describe('source logging',function(){});











});