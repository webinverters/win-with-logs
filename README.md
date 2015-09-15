## TODO:
- how to turn off debug logging in libraries by default?  Check bunyan, if not, then use the 'appName' to determine it...
- support config.name as an alias of config.component, but only document "component".
- trim down the fat for tracked events and only store component info, event label, and event details.

## Synopsis

The best Node.JS Logging Library.  A concise, human, and fully-featured logging client with out-of-the-box cloud backups, log streaming, and search support.

## Description & Motivation

Rather than creating yet another logging tool that focuses on storing and structuring your log data, here's a logging
client that will do all of the above, plus afford you unique capabilities.

### Unique Capabilities?

- Track and alert you when your application fails to meet an objective (Failed Goal Tracking)
- Create custom alerts triggered by incoming log data analysis  (via integration with Robust-Notifications)
- Real-Time centralized streaming logs viewable with your browser at robustly.io/logs/your-application-name (via integration with Robust-Logs)
- Provide "Event Aggregator" services
- Local log file rotation
- Cloud backups
- Log indexed, queryable events in addition to grepable string/binary streams.
- Works on most browser clients

## Setup

  npm install win-with-logs --save

__TODO:__ include tutorial on setting up robust account key.

- Require it in your codebase:

__Basic Configuration__:

    global.log = require('win-with-logs')({app: 'appName', env: 'dev', component: 'componentName'})

__Advanced Configuration with cloud integration__:

    var log = require('win-with-logs')({
      component: 'webservice',
      env: 'dev',
      app: 'test-app',
      recipients: [
       {
          name: 'Admin',
          email: 'admin@company.com',
          subscribeToTriggers: {
            events: [EVENT_TYPE1, EVENT_TYPE2'],
            levels: 'critical'  // default
          }
       }],
       robustKey: 'xxx',  // enables "Robustly.io" integration.
       cloudConfig: {
          enableTrackedEvents: true,    // tracked events are queryable events stored in the cloud,
          trackedEventSendInterval: 5,    // tracked events are sent to the cloud at this interval  (synchronizing event and streamed logs
          enableLogStreaming: true,     // enable logs to be stored on the cloud
          logSendInterval: 5,      // sends logs to the cloud every 5 seconds.
       }
    });

## Config

require('win-with-logs')(config)

### Mandatory Properties
*Basic properties for creating and identifying a new logger.*
  - config.component (string)
  - config.env (string)
  - config.component (string)

*Enable source level debug statements (poor performance: avoid in production.)*
  - config.debug (boolean) [false]

*Enable logging to files on the filesystem*
  - config.enableFSLogging (boolean) [true]

*Specify log files*
  - config.logFilePath (string)  [./log]
  - config.eventFilePath (string) [./events]
  - config.errorFilePath (string) [./errors]

*Control maximum log storage on the local file system.  Maximum = maxLogFileSize*maxLogFiles in bytes.  By default the maximum allowed is 5 one megabyte files.  After that, logs will be overwritten as per a circular buffer.  Since there are 3 log file types, the theoretical maximum file system storage is 15MB by default.*
  - config.maxLogFileSize (number) [1024*1000]
  - config.maxLogFiles (number) [5]

*Provide a robustKey for cloud integration.  You can get a free key at https://robustly.io*
  - config.robustKey (string)

  - config.cloudConfig.enabledTrackEvents (boolean) [enabled if robustKey is provided]
  - config.cloudConfig.trackedEventSendInterval (number) [5000ms]
  - config.cloudConfig.enableLogStreaming (boolean) [true]
  - config.cloudConfig.logSendInterval (number) [5000ms]

  __TODO: clarify what this goalLogFilePath is all about__
  - config.goalLogFilePath(string)

### Config Examples

```javascript
var basicConfig = {
    component"webservice",
    env: "dev",
    app: "test-app",
    debug:true
}

var WriteConfig = {
    component"webservice",
    env: "dev",
    app: "test-app",
    logFilePath: "../log",
    eventFilePath: "../log",
    errorFilePath: "../log",
    maxLogFileSize: 100000,
    maxLogFiles: 5,
}

var cloudConfig = {
    component: "webservice",
    env: "dev",
    app: "test-app",
    recipients: [],
    goalLogFilePath: "../log",
    robustKey: "string",
    cloudConfig: {
        enabledTrackedEvents: true,
        trackedEventSendInterval: 5,
        enableLogStreaming: true,
        logSendInterval: 5
    }
}

var enableEverythingConfig = {
    component"webservice",
    env: "dev",
    app: "test-app",
    logFilePath: "../log",
    eventFilePath: "../log",
    errorFilePath: "../log",
    maxLogFileSize: 100000,
    maxLogFiles: 5,
    goalLogFilePath: "../log",
    robustKey: "string",
    cloudConfig: {
        enabledTrackedEvents: true,
        trackedEventSendInterval: 5,
        enableLogStreaming: true,
        logSendInterval: 5
    }
}

```
<!-- __Kitchen Sink:__  (note: you do not have to make "log" a global singleton.)

    global.log = require('win-with-logs')({
      name: 'backend',
      env: 'dev',
      app: 'test-app'
      logFile: 'trace.log',
      errorLogFile: 'errors.log',
      robustKey: 'a-b-c',   // if you do not provide your robustKey (get one free at: https://robustly.io/register).  **You will not have access to any of the library's cloud hosted features.  
      recipients: [
       {
          name: 'Admin',
          email: 'admin@company.com',
          subscribeTo: 'EVENT_TYPE1, EVENT_TYPE2',
          criticalErrors: true  // default.
       }],
       robustKey: 'xxx'  // provide your robustKey for "Robust-*" integration
    }); -->

## API Reference

### Logging

#### Supported Log Levels
 - log.debug(msg,details)
 - log(msg,details)
 - log.warn(msg,details)
 - log.error(msg,details)
 - log.fatal(msg,details)

##### Description
The log levels allow you to filter out lower priority logging (ordered from greatest to lowest detail).  There are other important differences:
  - By default, FATAL level logging triggers an alert if you specify recipient email addresses in the config.
  - Tracked events cannot be triggered via DEBUG level logging, but can be triggered on all others.  __TODO: add link to more info on tracked events.__


##### Parameters
  - msg (string) *a message or event name*
  __Note:__ msg doubles as an event name when treated as such.  See more in TODO: link to event section.
  - details (object) *a details object to log*
  __Note:__ details is best used by keying the various properties.  For example,instead of log('The user:', user) -- it is better to write log('The user:', {user: user}).  Also,
  log.error('The error:', {err:err}) "err" property is formatted with a stack trace.

##### Returns
Will always resolve a promise (true)
If cloud logging is enabled, it will resolve when the event was sent.
If Filesystem logging is enabled, it will resolve when the entry is flushed.
otherwise, it will resolve immediately.
It is not required to wait for it to resolve.

##### Examples

```javascript

var basicConfig = {
        component: "webservice",
        env: "dev",
        app: "test-app"
    }

var log = require('win-with-logs')(basicConfig);

log()
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"undefined","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log("test")
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"test","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log({a: 1});
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"{a:1}","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log("a", "hello");
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"a hello","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log({details: {msg: "hello"}}, "message");
//outputs outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"details":{"msg":"hello"},"msg":"message","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log.warn("test")
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"test","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log.debug("test")
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"test","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log.error("test")
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"test","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

log.fatal("test")
//outputs {"name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"test","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

```

##### logging results and failures
   - log.success(name)
   - log.failure(err)

##### description
    methods for logging the results of function that returns a result or failure     
##### parameters
name - a string // mandatory
err - a valid error object //mandatory
##### output
will return the input exactly
##### examples
```javascript

var basicConfig = {
        component: "webservice",
        env: "dev",
        app: "test-app"
    }

var log = require('win-with-logs')(basicConfig);

function successTest(){
    return Promise.resolve("success")
}

function failureTest(){
    throw new Error("failure")
}


return successTest()
    .then(log.succeeded)
    .catch(log.failed)

//successTest() will work as normally and the event will be logged.

return failureTest()
    .then(log.succeeded)
    .catch(log.failed)

//failureTest() will fail as normal and the event will be logged.


```


##### log context methods
   - log.module(name)

##### description
will return a new logger for context logging     
##### parameters
name - a string // mandatory
##### output
will return the  with the similar properties
log,debug,fatal,error,warn,etc
##### examples

```javascript

var basicConfig = {
        component: "webservice",
        env: "dev",
        app: "test-app"
    }

var log = require('win-with-logs')(basicConfig);

log=log.module("testModule")
log("new context)
//all future log entries now contain the module name {module:"testModule",name":"test-app","component":"webservice","env":"dev","hostname":"MacBook-Pro.local","pid":69975,"level":30,"msg":"new context","time":"Sun Jan 1 2015 10:20:30 GMT-0400 (EDT)","v":0}

```


### Event Aggregator (pub/sub):

#### methods
   - log.addEventHandler(name,func)

##### description
Attach a listener to listen for events     
##### parameters
name - a string // mandatory
func - a function // mandatory
##### output
no output, this is a synchronous function
##### examples

```javascript

var basicConfig = {
        component: "webservice",
        env: "dev",
        app: "test-app"
    }

var log = require('win-with-logs')(basicConfig);

log.addEventHandler("test",function(){
console.log("test activated")
})

log("test")
//expect to see the following in the console "test activated"

```

### Goal Tracking:

#### methods
   - log.goal(name)

##### description
Create and start watching for a goal.     
##### parameters
name - a string // mandatory
##### output
no output, this is a synchronous function
##### examples

```javascript
var basicConfig = {
        component: "webservice",
        env: "dev",
        app: "test-app"
    }

var log = require('win-with-logs')(basicConfig);



function failureTest(){
    throw new Error("failure")
}

goal=log.goal("test")

return failureTest()
    .then(goal.succeeded)
    .catch(goal.failed)

//a failed goal will be logged and submitted to the cloud.

log.goal("test").succeeded(true)
//when a goal succeeds it will notify the cloud.
//the cloud will remove any existing failed goals with the same name.


```

## Tests

### Run unit tests:
    make

### Run integration tests:
    make int

### Run all tests:
    make all

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)
