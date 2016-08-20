global._ = require('lodash')
global.p = require('bluebird')

// create a wwl instance
var log = require('../index')({
  env: 'example',
  app: 'example',
  component: 'example',
  debug: false
});

log('Log object can be a function')

log = log.module('my module')

log.fatal("hello");
log.error("hello");
log.warn("hello");
log.log("hello");
log.debug("hello");


log.fatal("hello",{});
log.error("hello",{});
log.warn("hello",{});
log.log("hello",{});
log.debug("hello",{});


var logger=log.context({a:1});

logger.fatal("hello");
logger.error("hello");
logger.warn("hello");
logger.log("hello");
logger.debug("hello");

logger.fatal("hello",{});
logger.error("hello",{});
logger.warn("hello",{});
logger.log("hello",{});
logger.debug("hello",{});

p.resolve('the result')
  .then(log.result)

p.resolve('the result')
  .then(function(msg) {
    throw new Error(msg)
  })
  .catch(log.fail)
  .catch(log.failSuppressed)

log.addEventHandler("test",function(){
  console.log("event being run!")
});

log.info("test",{})
