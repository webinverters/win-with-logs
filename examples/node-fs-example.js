var config = {
  app: "test",
  env: "dev",
  component: "testComponents",
  logStreams: [
    {
      type: 'rotating-file-max',
      logFilePath: './examples/',
      maxLogFileSize: 1024,
      maxLogFiles: 3
    }
  ],
  debug: false
};

// create a wwl instance
var log = require('./../index')(config);

var count =0;
setInterval(function() {
  log.fatal("hello"+count);
  log.error("hello"+count);
  log.warn("hello"+count);
  log.log("hello"+count);
  log.debug("hello"+count);

  count++
}, 150)
