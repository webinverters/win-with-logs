var context_type = require('./index')
var type = require('./index')

describe('context-type.spec.js', function () {
  it('main usage', function () {
    var m = new context_type();
    m.addContext("hi", "goal");
    expect(m).to.be.an("object")
    expect(m.fullContext).to.deep.equal({goal: "hi"})
  });
  it('create nested context', function () {
    var m = new context_type();
    m.addContext("hi", "goal");
    m.addContext("hello", "goal");
    expect(m.fullContext).to.deep.equal({goal: "hi", goal_1: "hello"})
  });
  it('should be able to create a new context from an existing one', function () {
    var test = new context_type();
    test.addContext("hello", "greetings")
    var mn = new context_type(test);
    expect(test).to.deep.equal(mn);
  });
  it('all properties of the original should be a deep copy', function () {
    var test = new context_type();
    test.addContext("hello", "greetings");

    var copy = new context_type(test);
    test.addContext("hello", "greetings1");
    expect(test).to.not.deep.equal(copy);
  })
  it('can take in an object to specify an existing context', function () {
    var test = new context_type({hello: "world"});
    expect(test.fullContext).to.deep.equal({hello: "world"})
  })
});