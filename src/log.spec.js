'use strict';

var Logger = require('./log');

describe('log', function(){
  var m, mProvider;

  beforeEach(function() {
    mProvider = {
      debug: sinon.spy(),
      info: sinon.spy(),
      error: sinon.spy(),
      fatal: sinon.spy(),
      warn: sinon.spy(),
      on: sinon.spy()
    };

    m = Logger({}, mProvider);
  });

  describe('debug()', function() {
    it("calls the log provider's debug level log API", function() {
      m.debug('test');
      expect(mProvider.debug).to.have.been.calledWith('test');
    })
  });

  describe('log()', function() {
    it("calls the log provider's info level log API", function() {
      m.log('test');
      expect(mProvider.info).to.have.been.calledWith('test');
    })
  });

  describe('logError()', function() {
    it('calls the log providers error level log API', function() {
      m.logError('test');
      expect(mProvider.error).to.have.been.calledWith('test');
    });
  });

  describe('logFatal()', function() {
    it('calls the log providers error Fatal log API', function() {
      m.logFatal('test');
      expect(mProvider.fatal).to.have.been.calledWith('test');
    });
  });

  describe('logWarn()', function() {
    it('calls the log providers error Warn log API', function() {
      m.logWarn('test');
      expect(mProvider.warn).to.have.been.calledWith('test');
    });
  });

});