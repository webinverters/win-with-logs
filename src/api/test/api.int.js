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
      })

  })
  it('delete any older files and count to the next highest number',function(){
    exec("cd testing;touch log0.log log1.log log2.log log3.log log4.log log5.log log6.log")
    var basicConfig = {
      component:"webservice",
      env: "dev",
      app: "test-app",
      logFilePath: './testing/',
      maxLogFileSize: 200
    };
    var log=m(basicConfig);
    log("hello")
    expect(fs.readdirSync('./testing').length).to.equal(5)
  })

});

