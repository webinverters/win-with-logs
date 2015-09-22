var m=require('../index');

describe('pubSub',function(){
  describe('on event',function(){
    it('runs function on event',function(){
      var mock=sinon.stub().returns(true)
      m.addEventHandler("test",mock)
      m.handleEvent("test")
      expect(mock.callCount).to.equal(1)
    })
    it('runs function on event',function(){
      var mock=sinon.stub().returns(true)
      m.addEventHandler("test",mock)
      m.handleEvent("test")
      m.handleEvent("test")
      expect(mock.callCount).to.equal(2)
    })
    it('runs function on event',function(){
      var mock=sinon.stub().returns(true)
      m.handleEvent("test1")
      m.handleEvent("test9")
      expect(mock.callCount).to.equal(0)
    })
  })
})