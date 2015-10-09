var goalApi=require('./index');
var transportType=require('../../data-types/transport-type')

var transport=new transportType;



describe('goalApi tltl',function(){
  var bunyan
  beforeEach(function(){
    bunyan={
      log:sinon.stub().resolves("logData")
    }
  })
  it('happy path',function(){




      var m = new goalApi("goal", bunyan)

      m.log("hi")
        //.then(function(){
        //  return m.complete
        //})
        //.then(function(){
        //  done();
        //})
      m.warn("hello");
      m.debug("hi");
      m.fatal("hi?");
      m.error("it");
      //
      //m.complete("success");
      //m.fail("failure");



  })
})