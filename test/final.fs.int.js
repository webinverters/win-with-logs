var winWithLogs = require('../index');
var exec = require('./helpers/exec');
var fsTest = require('./helpers/checkFile');


describe('File system', function () {
  beforeEach(function (done) {
    config = {
      app: "test",
      env: "dev",
      component: "testComponents",
      silent:false,
      debug:false,
      streams: [
        {
          logFileName: 'log',
          logFilePath: './testing/',
          maxLogFileSize: 100000,
          maxLogFiles: 5
        }
      ]
    };
    exec("rm -rf testing;")
      .then(function () {
        return exec("mkdir testing")
      })
      .then(done)
  });
  afterEach(function (done) {
    exec("rm -rf testing")
      .then(done)
  });
  after(function (done) {
    exec("rm -rf testing;")
      .then(done)
  });

  it('Writes to file', function (done) {

    var log = winWithLogs(config);
    log.log("hi").then(function () {
      expect(fsTest.hasFile("./testing", "log0.log")).to.equal(true)
      done();
    })
  });
  describe('regular api calls', function () {
    it('writes entries to log file ', function (done) {
      var log = new winWithLogs(config);
      return log.log("hi")
        .then(function () {
          expect(fsTest.hasFile("./testing", "log0.log")).to.equal(true)
          expect(fsTest.containLines('./testing/log0.log', ["hi"])).to.equal(true, "log should have been written to filesystem")
          done()
        })
    })
    it('writes entries to log file ', function (done) {
      var log = new winWithLogs(config);
      return log.warn("hi", {a: 1})
        .then(function () {
          expect(fsTest.hasFile("./testing", "log0.log")).to.equal(true)
          expect(fsTest.containLines('./testing/log0.log', ["hi"])).to.equal(true, "log should have been written to filesystem")
          done()
        })
    })
  });

  describe('when exceeding file size ', function () {
    beforeEach(function () {
      config.streams[0].maxLogFileSize = 100;
    });
    it('creates a new log file', function (done) {
      var log = new winWithLogs(config);
      return log.warn("hi")
        .then(function () {
          return log.log("hello")
        })
        .then(function () {
          expect(fsTest.hasFile("./testing", "log0.log")).to.equal(true)
          expect(fsTest.hasFile("./testing", "log1.log")).to.equal(true)
          expect(fsTest.containLines('./testing/log0.log', ["hi"])).to.equal(true, "log should have been written to filesystem")
          expect(fsTest.containLines('./testing/log1.log', ["hello"])).to.equal(true, "log should have been written to filesystem")
          done()
        })
    })
  });

  describe('when exceeding max file count', function () {
    beforeEach(function (done) {
      config.streams[0].maxLogFileSize = 100;
      config.streams[0].maxLogFiles = 2;
      exec("cd testing;")
        .then(function () {
          return exec('touch testing/log0.log testing/log1.log testing/log2.log testing/log3.log')
        })
        .then(done)

    });
    it('delete old files after first log', function () {
      var log = new winWithLogs(config);
      log.log("hi");
      expect(fsTest.hasFile("./testing", "log0.log")).to.equal(false);
      expect(fsTest.hasFile("./testing", "log1.log")).to.equal(false);
      expect(fsTest.hasFile("./testing", "log2.log")).to.equal(false);
      expect(fsTest.hasFile("./testing", "log3.log")).to.equal(true);
      expect(fsTest.hasFile("./testing", "log4.log")).to.equal(true);
    });
    it('delete old files when rotating files', function (done) {
      var log = new winWithLogs(config);
      return log.warn("hi")
        .then(function () {
          return log.log("hello")
        })
        .then(function () {
          expect(fsTest.hasFile("./testing", "log0.log")).to.equal(false);
          expect(fsTest.hasFile("./testing", "log1.log")).to.equal(false);
          expect(fsTest.hasFile("./testing", "log2.log")).to.equal(false);
          expect(fsTest.hasFile("./testing", "log3.log")).to.equal(false);
          expect(fsTest.hasFile("./testing", "log4.log")).to.equal(true);
          expect(fsTest.hasFile("./testing", "log4.log")).to.equal(true);
          done();
        })
    })
  })
});




