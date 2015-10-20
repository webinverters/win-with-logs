var m = require('../src/api/final-api');
var newUp = require('./helpers/newUp');

var validConfigs = {
  basic: {component: 'test', env: 'dev', app: 'testapp'},
  debugEnabled: {component: 'test', env: 'dev', app: 'testapp', debug: true},
  debugDisabled: {component: 'test', env: 'dev', app: 'testapp', debug: false}
};

var invalidConfig = [
  ["'empty Object'", {}, "invalid param"],
  ["'missing component'", {env: "test", app: 'test'}, "invalid param"],
  //["'missing component'", {component: "test", env: "test"}, "invalid param"],
  ["'missing component'", {component: "test", app: "test"}, "invalid param"]
];


describe('winWithLogs constructor', function () {
  describe('valid config files', function () {
    _.forEach(validConfigs, function (config, configName) {
      it('does not throw an error when passed a ' + configName + ' config', function () {
        expect(function () {
          var log = newUp(m, [config])
        }).to.not.throw()
      })
    })
  });
  describe('invalid config files', function () {
    _.forEach(invalidConfig, function (config) {
      it('does not throw an error when passed a ' + config[0] + ' config', function () {
        expect(function () {
          var log = newUp(m, [config[1]])
        }).to.throw(config[2])
      })
    })
  })
});


describe('methods', function () {
  var methods = [
    'log', 'warn', 'error', 'debug', 'fatal',
    'goal', 'context',
    'result', 'fail', 'failSuppressed', 'rejectWithCode'
  ];

  _.forEach(methods, function (prop) {
    it('contains a method called : ' + prop, function () {
      var log = m({app: "abc", env: "aaa", component: "aaa"});
      expect(log).to.have.property(prop)
      expect(log[prop]).to.be.a("function")
    });
    it('log.context has the following methods : '+prop,function(){
      var log = m({app: "abc", env: "aaa", component: "aaa"});
      var newContext=log.context({a:1});
      expect(newContext).to.have.property(prop)
      expect(newContext[prop]).to.be.a("function")
    });
    xit('log.goal has the following methods : '+prop,function(){
      var log = m({app: "abc", env: "aaa", component: "aaa"});
      var newContext=log.goal({a:1});
      expect(newContext).to.have.property(prop)
      expect(newContext[prop]).to.be.a("function")
    })
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
