proxyquire = require('proxyquire').noPreserveCache();//can't use in config?

var m=proxyquire('../index.js',{"fs":{
  createWriteStream:sinon.stub().returns({write:function(a,b){
    //console.log(a);
    setTimeout(b,0)
  }})
}});


describe('file manager',function(){
  it('writes to log file.',function(){
    var path="./"
    var name="test.log";
    var maxFileSize=1000000;
    var maxFilesCount=5;
    var file=m(path,name,maxFileSize,maxFilesCount);

    file.writeLogEntry("test")

    return file.waiter()//resolves when entry is flushed
      .then(function(){

      })
  })
});