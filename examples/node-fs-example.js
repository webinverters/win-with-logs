global._ = require('lodash')
global.p = require('bluebird')


var config = {
  app: "test",
  env: "dev",
  component: "testComponents",
  streams: [
    {
      logFileName: 'log',
      logFilePath: './examples/',
      maxLogFileSize: 100000,
      maxLogFiles: 5
    }
  ]
};

// create a wwl instance
var log = require('./../index')(config);


log.fatal("hello");
log.error("hello");
log.warn("hello");
log.log("hello");
log.debug("hello");


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




log.result("hi").then(console.log);
log.fail("hi").catch(console.log);
log.failSuppressed("hi").then(console.log);