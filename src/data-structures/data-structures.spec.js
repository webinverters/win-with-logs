var log = require('./index').log_type

describe('data-structures', function () {
  describe('log return proper properties', function () {
    var param;
    beforeEach(function () {
      param = {};
    });

    it('when passed a string', function () {
      param.name="string"
      var instance= new log(param);
      expect(instance.msg).to.equal("string")
      expect(instance.obj).to.equal(false)
    });
    it('when passed an object', function () {
      param.name={a:1}
      var instance= new log(param);
      expect(instance.msg).to.equal(JSON.stringify(param.name))
      expect(instance.obj).to.equal(JSON.stringify(param.name))
    });
    it('when passed nothing',function(){
      expect(function(){
        var instance= new log(param);
      }).to.throw("missing name property")
    });

    it('when passed two strings')
    it('when passed two objects')
    it('when passed a string and then an object')
    it('when passed an object and then a string')

  })
})