//var pubSub = require('./index');
//
//describe('pubSub implementation', function () {
//  it('will do nothing when there is no event handler created', function () {
//    var testFunc = sinon.stub().returns(true);
//    var m = new pubSub;
//    m.handleEvent("@test")
//    expect(testFunc).to.not.have.been.called;
//  });
//
//  it('will call event function when event is triggered.', function () {
//    var testFunc = sinon.stub().returns(true);
//    var m = new pubSub;
//    m.addEventHandler("test", testFunc);
//    return m.handleEvent("@test").then(function () {
//      expect(testFunc).to.have.been.called;
//    })
//  })
//});