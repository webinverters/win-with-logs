## TODO: 
- how to turn off debug logging in libraries by default?  Check bunyan, if not, then use the 'appName' to determine it...
- convert to isotime for timestamps when viewing logs.

## Synopsis

The best Node.JS Logging Library.  A concise, human, and fully-featured logging client with out-of-the-box cloud integration, by Justin Mooser & Robustly.io

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

TODO: trim down the fat for tracked events and only store component info, event label, and event details.

## Code Example

var log = require('win-with-logs')({
  component: 'webservice',
  env: 'dev',
  app: 'test-app',
  logFilePath: '.',
  errorLogFilePath: '.',
  trackedEventLogFilePath: '.',
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

// LOGGING API:

log.module('ModuleName', { })
log.method('MethodName', { })
log.result('MethodName')
log.rejectWithCode('CODE')

// log a tracked event (that you can query by)
log('@USAGE_LEVEL', {superdate: 'sumptuous', valueInt: 10, valueStr: 'whatever'});

// log an event (untracked)
log('Something happened...', {superdate: 'sumptuous', valueInt: 10, valueStr: 'whatever'});

// log an error (tracked)
log.error('@MESSAGE_CORRUPTED', {messageId: 'topgun'});

// log a critical error and receive notifications immediately.
logger.fatal('SOMETHING_BAD_HAPPENED', details)  // sends a notification.

// Pub/Sub API:

// components can react to application events
 function handler(event, details) { }
 log.eventHandler('EVENT_LABEL', handler)

// trigger the handler via:
 log('EVENT_LABEL', { info: 'some details here.'})

// Log Viewing API:

 log.getLogs({timestamp:0, limit:100})

// Tracked Event Query API:

 log.query({
    event: '@POWER_OUTAGE',
    before: epoch_timestamp,
    limit: 10
 })

 log.query({
   event: '@DATA_LOSS',
   index: 'type7'
 })

// Goal Logging API:
 var goal = log.goal({goalName: 'MyGoal', goalId: 'xyz'})
 log.failedGoal({ goalName: 'DeleteFolder', goalId: 'uniqueInstanceId', details: {} })  // details optional
 log.failedGoal(goal)  // same as above but demonstrates the purpose of createGoal()
 goal.log('EVENT', details)  // log some details which will get tracked with the goal itself.
 log.completedGoal(goal)
 log.listGoals({timestamp:0, limit:100, goalName: '', goalId: '', completed: false})


## Installation

Provide code examples and explanations of how to get the project.

    npm install win-with-logs --save
    
- Require it in your codebase: 

__Barebones__:

    global.log = require('win-with-logs')({app: 'appName', env: 'dev', name: 'componentName', robustKey: 'a-b-c'})

__Kitchen Sink:__  (note: you do not have to make "log" a global singleton.)
    
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
    });

## API Reference

### logging

##### log methods
   - log(msg,details)
   - log.warn(msg,details)
   - log.fatal(msg,details)
   - log.debug(msg,details)
   - log.error(msg,details)

##### description
Will log an entry with a level of log     
##### parameters
msg - a string or object // mandatory
details - string or object //optional
##### output
Will always resolve a promise (true)
If fs logging is enabled, it will resolve when the entry is flushed.
otherwise, it will resolve immediately.
It is not required to wait for it to resolve.
##### examples

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

log("new context)
//expect to see the following in the console "test activated" 


```

### Goal Tracking:


## Tests

npm install -g kinesalite

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)