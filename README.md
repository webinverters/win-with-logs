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

## Code Example

var log = require('win-with-logs')({
  name: 'webservice',
  env: 'dev',
  app: 'test-app'
  enableTrackedEvents: true,  // default is true
  logFile: '{app}.log',
  recipients: [
   {
      name: 'Admin',
      email: 'admin@company.com',
      subscribeTo: 'EVENT_TYPE1, EVENT_TYPE2',
      criticalErrors: true  // default.
   }],
   robustKey: 'xxx'  // provide your robustKey for "Robust-*" integration
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

 log.getErrors({timestamp:0, limit:100})
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


### Event Aggregator (pub/sub): 

### Goal Tracking:


## Tests

npm install -g kinesalite

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)