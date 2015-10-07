var logger = require('./index.js');
var log = require('../../data-structures').log;
var context = require('../../data-structures').context;
var transports = require('../../data-structures').transports;

var bunyan = {log: sinon.stub().resolves(true)}

describe('logger.js', function () {
  beforeEach(function () {

  });
  it("it doesn't throw an error when called validly", function (done) {
    var temp = new logger(bunyan, new context([]), new transports([]))
    return temp.log("hi").then(function () {
      var newtemp = temp.context("hello")
      newtemp.log("hi")
        .then(function () {
          done()
        })
    })
  })
  it('logger.log')


})