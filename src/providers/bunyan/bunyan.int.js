//var m = require('./index')
//describe('bunyan', function () {
//  it('happy path', function () {
//    var config = {app: "test", component: "component", env: "dev"}
//    var log = new m(config);
//    return log.log("debug","hello", "")
//      .then(function (result) {
//        expect(result.message).to.be.a("object")
//      })
//  });
//  describe('returns an instance that returns a log object', function () {
//    it('returns a promise that formats log data with bunyan', function (done) {
//      var temp = new m({app: "test", component: "test", env: "dev"})
//      return temp.log("debug","hi")
//        .then(function (result) {
//          console.log(result)
//          expect(result.message).to.have.property("env")
//          done();
//        })
//    })
//  })
//});