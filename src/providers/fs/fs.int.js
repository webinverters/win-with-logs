var m = require('./index');
var exec = require('../../../test/helpers/exec')
var fileConfig = require('../../data-structures').file_config;
var fsTest = require('../../../test/helpers/checkFile');

describe('fsProvider', function () {
  var config;
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
       .then(function(){
         return exec('mkdir testing')
       })
       .then(done)
  });
  afterEach(function () {
    return exec("rm -rf testing;")
  });
  it('creates a new file and writes to the file.', function () {
    var fsConfig = new fileConfig(config.logFilePath, config.maxLogFileSize, config.maxLogFiles);
    var fsInstance = new m(fsConfig);
    return fsInstance.write("hello")
      .then(function () {
        expect(fsTest.hasFile("./testing", "log0.log")).to.equal(true)
        expect(fsTest.containLines('./testing/log0.log', ["hello"])).to.equal(true, "data should have been written to filesystem")
      })
  });
});