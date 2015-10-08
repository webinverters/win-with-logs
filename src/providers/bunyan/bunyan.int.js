var m = require('./index')
describe('bunyan', function () {
  it('happy path', function () {
    var config = {app: "test", component: "component", env: "dev"}
    var log = new m(config);
    return log.log("hello", "")
      .then(function (result) {
        expect(result.message).to.be.a("string")
      })
  });
  describe('returns an instance that returns a log object', function () {
    it('returns a promise that formats log data with bunyan', function (done) {
      var temp = new m({app: "test", component: "test", env: "dev"})
      return temp.log("hi")
        .then(function (result) {
          expect(result.message).to.contain('"env":"dev"')
          done();
        })
    })
  })
});