var m = require('./index');
var exec = require('../../../test/helpers/exec');
var fsTest = require('../../../test/helpers/checkFile');

describe('fsProvider', function () {
  var config;
  before(function (done) {
    exec('rm -rf testing1;mkdir testing1')
      .then(function () {
        done()
      })
  });
  beforeEach(function (done) {
    config = {
      logFilePath: './testing1/',
      logFileName:'log',
      maxLogFileSize: 100000,
      maxLogFiles: 5
    };
    exec("rm -rf testing1;mkdir testing1")
      .then(function () {
        done()
      })
  });
  afterEach(function (done) {
    exec("rm -rf testing1")
      .then(function () {
        done();
      })
  });
  it('creates a new file and writes to the file.', function (done) {
    var fsConfig = {
      logFileName:config.logFileName,
      logFilePath: config.logFilePath,
      maxLogFileSize: config.maxLogFileSize,
      maxLogFiles: config.maxLogFiles
    };
    var fsInstance = new m(fsConfig);
    return fsInstance.write("hello")
      .then(function () {
        expect(fsTest.hasFile("./testing1", "log0.log")).to.equal(true)
        expect(fsTest.containLines('./testing1/log0.log', ["hello"])).to.equal(true, "data should have been written to filesystem")
        done();
      })
  });
});

