proxyquire = require('proxyquire').noPreserveCache();//can't use in config?
var exec=require('child_process').execSync || require('exec-sync');

var func = sinon.stub().returns({write:function(a,b){
  setTimeout(b,0)
}})

var m=proxyquire('../index.js',{"fs":{
  createWriteStream:func
}})

xdescribe('xxxj file manager',function(){
  it('resolves a promise',function(done){
    var path="./testing"
    var maxFileSize=1000000;
    var maxFilesCount=5;
    var file=m(path,maxFileSize,maxFilesCount);

    file.writeLogEntry("test")

    return file.waiter()//resolves when entry is flushed
      .then(function(){
        //expect(func).to.have.been.called
        done();
      })
  });
});