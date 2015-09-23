proxyquire = require('proxyquire').noPreserveCache();//can't use in config?

var mock={
  uploadToCloud:sinon.stub().resolves(true)
};

var cloud=proxyquire('../index', {"./helper":function(){return mock}})
var m;
var clock;

describe('cloud Manager',function(){

  beforeEach(function(){
    clock = sinon.useFakeTimers(1000000);
    m=cloud({
      robustKey: 123,
      enableLogStreaming: true,
      logSendInterval: 300
    })
  });
  afterEach(function(){
    clock.restore()
  });


  it('uploads to cloud every set interval',function(){

    m.writeLogEntry("abc");
    clock.tick(401);
    expect(mock.uploadToCloud.callCount).to.equal(1)
  })


});