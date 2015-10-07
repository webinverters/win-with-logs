var transportType = require('./index');

describe('transportType aaz', function () {
  it('happyPath', function () {

    var m = new transportType;
    m.addTransport(console.log, "debug");
    m.addTransport(console.log, "debug");
    console.log(m.actions)

    var n = new transportType(m)
    console.log(n.actions)

  })
});