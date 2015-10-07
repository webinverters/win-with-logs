var m = require('./index')
describe('bunyan', function () {
  describe('returns an instance that returns a log object', function () {
    it('returns a promise that formats log data with bunyan', function (done) {
      var temp = new m({app: "test", component: "test", env: "dev"})
      return temp.log("hi")
        .then(function (result) {
          expect(JSON.stringify(result)).to.contain('"env":"dev"')
          done();
        })
    })
  })
});