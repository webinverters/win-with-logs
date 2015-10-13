var winWithLogs = require('./index');

var exec = require('../../../test/helpers/exec')
var fsTest = require('../../../test/helpers/checkFile');
var fs = require('fs')

describe('when passed a filesystem config', function () {
  beforeEach(function (done) {
    config = {
      app: "test",
      env: "dev",
      component: "testComponents",
      logFilePath: './testing/',
      maxLogFileSize: 100000,
      maxLogFiles: 5
    };
    exec("rm -rf testing;")
      .then(function () {
        return exec("mkdir testing")
      })
      .then(function () {
        done();
      })
  });
  afterEach(function (done) {
    exec("rm -rf testing")
      .then(function(){
        done();
      })
  });
  after(function (done) {
    exec("rm -rf testing;")
      .then(function () {
        done()
      })
  });

  it('creates a new log file after first log nowtl123', function () {
    var log = new winWithLogs(config);
    return log.log("hi").then(function () {
      expect(fsTest.hasFile("./testing", "log0.log")).to.equal(true)
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
      config.maxLogFileSize = 100;
    })
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
  describe('when exceeding max file count ', function () {
    beforeEach(function (done) {
      config.maxLogFileSize = 100;
      config.maxLogFiles = 2
      exec("cd testing;")
        .then(function () {
          return exec('touch testing/log0.log testing/log1.log testing/log2.log testing/log3.log')
        })
        .then(done)

    });
    it('delete old files', function () {
      var log = new winWithLogs(config);
      expect(fsTest.hasFile("./testing", "log0.log")).to.equal(false);
      expect(fsTest.hasFile("./testing", "log1.log")).to.equal(false);
      expect(fsTest.hasFile("./testing", "log2.log")).to.equal(false);
      expect(fsTest.hasFile("./testing", "log3.log")).to.equal(true);
      expect(fsTest.hasFile("./testing", "log4.log")).to.equal(true);
    })
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