var m=require('../index')
var exec=require('child_process').execSync;
var fs=require('fs')
var fsHelper=require('../../../test/helpers/checkFile');

describe('log writes to a filesystem',function(){
  beforeEach(function(){
    exec("rm -rf testing;mkdir testing")
  });
  after(function(){
    exec("rm -rf testing")
  });
  it('logs to a file',function(){
    var basicConfig = {
      component:"webservice",
      env: "dev",
      app: "test-app",
      logFilePath: './testing/',
      maxLogFileSize: 100000
    };
    var log=m(basicConfig);

     return p.resolve()
      .then(function(){
        return log("hello world")
      })
      .then(function(){
        return log("hi")
      })
      .then(function(){
        expect(fsHelper.hasFile('./testing','log0.log')).to.equal(true,"log should have written a file")
        expect(fsHelper.containLines('./testing/log0.log',['hello world','hi'])).to.equal(true,"file does not contain log entries")
      })
  });

  it('logs rotate file when size is exceeded tzx',function(){
    var basicConfig = {
      component:"webservice",
      env: "dev",
      app: "test-app",
      logFilePath: './testing/',
      maxLogFileSize: 200
    };
    var log=m(basicConfig);

    return p.resolve()
      .then(function(){
        return log("hello world")
      })
      .then(function(){
        return log("hi")
      })
      .then(function(){
        expect(fsHelper.hasFile('./testing','log0.log')).to.equal(true,"log should have written a file");
        expect(fsHelper.hasFile('./testing','log1.log')).to.equal(true,"log should have written a file");
        expect(fsHelper.containLines('./testing/log0.log',['hello world'])).to.equal(true,"file does not contain log entries")
        expect(fsHelper.containLines('./testing/log1.log',['hi'])).to.equal(true,"file does not contain log entries")
        //console.log(fs.statSync("./testing/test1.log").size)
      })

  })
});

