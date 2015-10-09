var transportType = require('./index');

describe('transportType', function () {
  it('happyPath', function () {

    var m = new transportType;
    m.addTransport(console.log, "debug");
    m.addTransport(console.log, "debug");

    var n = new transportType(m)

  })
});