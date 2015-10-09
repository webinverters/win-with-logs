var logMessage_type=require('./index')


describe('logMessage_type',function(){
  it('happy path',function(){

   var temp=new logMessage_type();

    var temp1=new logMessage_type("hello");
    var temp2=new logMessage_type("hello","hi");
    var temp3=new logMessage_type("hello",{a:1});

    var temp4=new logMessage_type({a:1});
    var temp5=new logMessage_type({a:1},"hi");
    var temp6=new logMessage_type({a:1},{a:2});


  })
});