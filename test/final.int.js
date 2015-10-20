var m = require('../index');

describe('finaltl', function () {
  it('world', function () {

    var log = m({app: "abc", env: "aaa", component: "aaa"});
    log.log("hi?", {});
    log.warn("hi?", {});
    log.debug("hi?", {});
    log.fatal("hi?", {});
    log.error("hi?", {})
  });
  it('context', function () {
    var log = m({app: "abc", env: "aaa", component: "aaa"}).context({a: 1});
    log.log("hello?1");
    log.warn("hello?2");
    log.debug("hello3?", {});
    log.fatal("hello", {});
    log.error("hello?", {})

    log.result("123")
  })

  it('catch error', function () {
    var log = m({app: "abc", env: "aaa", component: "aaa"})

    function test() {
      throw new Error("test")
    }

    expect(function () {
      return p.resolve()
        .then(test)
        .catch(log.failSuppressed)
    }).to.not.throw()


  })

});


describe('finaltl constructor', function () {

  describe('valid config files', function () {
    it('does not throw an error when a valid config is passed', function () {
      expect(function () {
        var log = m({app: "abc", env: "aaa", component: "aaa"});

      }).to.not.throw()
    })
  })
  describe('invalid config files', function () {
    it('throws an error when an invalid config is passed', function () {
      expect(function () {
        var log = m({app: "abc", env: "aaa"});

      }).to.throw()
    })

  })

});