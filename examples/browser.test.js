var log = winWithLogs({
  env: 'example', app: 'example', component: 'example'
});


log.fatal("hello");
log.error("hello");
log.warn("hello");
log.log("hello");
log.debug("hello");


log.fatal("hello", {});
log.error("hello", {});
log.warn("hello", {});
log.log("hello", {});
log.debug("hello", {});


var logger = log.context({a: 1});

logger.fatal("hello");
logger.error("hello");
logger.warn("hello");
logger.log("hello");
logger.debug("hello");

logger.fatal("hello", {});
logger.error("hello", {});
logger.warn("hello", {});
logger.log("hello", {});
logger.debug("hello", {});


log.result("hi",{a:1}).then(console.log.bind(console));
log.fail("hi").catch(console.log.bind(console));
log.failSuppressed("hi").then(console.log.bind(console));
