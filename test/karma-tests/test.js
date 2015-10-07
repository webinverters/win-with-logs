describe("win-with-logs", function () {
  beforeEach(function () {
    sinon.spy(console, "log")
  });

  afterEach(function () {
    console.log.reset()
  });

  it('should write to console.log', function () {

    var log=winWithLogs(config = {
      app: "test",
      env: "dev",
      component: "testComponents"
    });
    return log("hello world!!!").then(function(){
      expect(console.log.callCount).to.equal(1)
      expect(console.log.calledWith(sinon.match("hello world"))).to.equal(false)
    })


  });
});