var m = require('../src/win-with-logs');
var newUp = require('./helpers/newUp');

var validConfigs = {
  basic: {component: 'test', env: 'dev', app: 'testapp',debug:false,silent:false,isNode:false},
  debugEnabled: {component: 'test', env: 'dev', app: 'testapp', debug: true,silent:false,isNode:false},
  debugDisabled: {component: 'test', env: 'dev', app: 'testapp', debug: false,silent:false,isNode:false}
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
    'result', 'fail', 'failSuppressed', 'rejectWithCode',
    'addEventHandler'
  ];
  //we are setting isNode to false for this test because we don't want to new up a pretty stream for each test.
  var config={app: "abc", env: "aaa", component: "aaa",debug:false,silent:false,isNode:false}

  _.forEach(methods, function (prop) {
    it('contains a method called  nowtl: ' + prop, function () {
      var log = m(config);
      expect(log).to.have.property(prop)
      expect(log[prop]).to.be.a("function")
    });
    it('log.context has the following methods : ' + prop, function () {
      var log = m(config);
      var newContext = log.context({a: 1});
      expect(newContext).to.have.property(prop)
      expect(newContext[prop]).to.be.a("function")
    });
    it('log.goal has the following methods : ' + prop, function () {
      var log = m(config);
      var newContext = log.goal({a: 1});
      expect(newContext).to.have.property(prop)
      expect(newContext[prop]).to.be.a("function")
    })
  });


  it('context', function () {
    var log = m(config);
    log.log("hello?1");
    log.warn("hello?2");
    log.debug("hello3?", {});
    log.fatal("hello", {});
    log.error("hello?", {});
    log.result("123")
  });

  it('catch error', function () {
    var log = m(config);

    function test() {
      throw new Error("test")
    }

    expect(function () {
      return p.resolve()
        .then(test)
        .catch(function (e) {
          log.failSuppressed(e)
        })
    }).to.not.throw()
  })

  it('pubSub',function(){
    var log = m(config);
    log.addEventHandler("test",function(){
      console.log("da event!!")
    });
    log.log("@test",{})
    log.warn("hello world?")

  })
});
