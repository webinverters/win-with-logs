/**
 * @module docs.js
 * @summary: This module's purpose is to document the functionality of win-with-logs
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-09-08.
 * @license Apache-2.0
 */

"use strict";

var log = require('win-with-logs')({

  component: 'webservice',
  env: 'dev',
  app: 'test-app',

  debug: false,  // debug mode.  Set to true for all features.

  silent: false, // or true to disable console logging.

  // Log Streams
  streams: [
    {
      path: 'blah',
      logType: ''  // all, debug, log, event, warn, error, fatal, goal,
      maxSizeMB: 1,
      maxCount: 5,
      formatter: function(chunk,done) {}  // NOT MVP,
      hook: function(chunk,done) {}
    }
  ],
  robustKey: 'xxx',  // enables "Robustly.io" integration.

  cloudConfig: {
    enableTrackedEvents: true,    // tracked events are queryable events stored in the cloud, sent immediately.
    enableLogStreaming: true,     // enable logs to be stored on the cloud
    logSendInterval: 5,      // sends logs to the cloud every 5 seconds.
    recipients: [
      {
        name: 'Admin',
        email: 'admin@company.com',
      }
    ],
    logEndpoint: '' // Robust doesn't require this, it has a default...
    queryEndpoint: ''
    // notifyTriggers: {  // triggers means that when the events occur, this recipient will be notified.
    //   events: ['EVENT_TYPE1', 'EVENT_TYPE2'],
    //   levels: 'critical'  // default,
    //   recipient: 'Admin'
    // }
  }
});

var log = function log() {}  // remember all functions are objects

/**
 * Creates a child logger with the context info appended to its context.
 *
 * @param  {[type]} contextInfo [description]
 * @return {[type]}             [description]
 */
log.context = function(contextInfo) {

}

/**
 * Returns a new log context appended with the module name details.
 *
 * @param moduleName
 * @param details
 * TODO: support details param.
 */
log.module = function(moduleName, details) {

};

/**
 * Logs the result.  If this is a goal context, it marks the goal completed.
 * Returns the result
 *
 * @param resultValue
 * @param msg
 *
 * TODO: Rename to result.  Also fix for goal contexts.
 */
log.result = function(result) {

};

/**
 * @note if details contains a goalName and goalId, then it will be logged against the failed goal if it exists.
 * If you specify an @ symbol at the beginning of msg, it will cause the event queue to flush immediately.
 *
 * @param msg  If msg begins with an '@' symbol this becomes a tracked event.
 * @param details  There are some special properties in details that if provided can make the logs better.  But what are they all?
 *
 * @return Resolves a promise which resolves when all events have been flushed to persistent storage (or cloud), and all handlers have completed,
 * TODO: needs to be a function object which can be called (log instead of logger.log).
 * - FS needs to return promise when flushed
 */
log = function(msg, details) {

};
log.log = log

/**
 *
 * @param msg  If msg begins with an '@' symbol this becomes a tracked event.
 * @param details  There are some special properties in details that if provided can make the logs better.  But what are they all?
 */
log.debug = function(msg, details) {

};

/**
 *
 * @param msg  If msg begins with an '@' symbol this becomes a tracked event.
 * @param details  There are some special properties in details that if provided can make the logs better.  But what are they all?
 */
log.error = function(msg, details) {

};
/**
 *
 * @param msg  If msg begins with an '@' symbol this becomes a tracked event.
 * @param details  There are some special properties in details that if provided can make the logs better.  But what are they all?
 */
log.warn = function(msg, details) {

};
/**
 *
 * @param msg  If msg begins with an '@' symbol this becomes a tracked event.
 * @param details  There are some special properties in details that if provided can make the logs better.  But what are they all?
 */
log.fatal = function(msg, details) {

};
// Logging API Examples:

// log a tracked event (that you can query by)
log('@USAGE_LEVEL', {data: 0, index: '10'});

// log an event (untracked)
log.debug('Something happened...', {superdate: '01-01-01', valueInt: 10, valueStr: 'whatever'});

// log an error (tracked)
log.error('@MESSAGE_CORRUPTED', {messageId: 'topgun'});

// log a warning
log.warn('Something might be an issue', details)

// log a critical error and receive notifications immediately if a recipient was specified with a "critical" level trigger.
log.fatal('SOMETHING_BAD_HAPPENED', details)  // sends a notification.


// ===== Pub/Sub API: =======

/**
 *
 * @param eventLabel
 * @param handler
 * @param options.throttleInterval  Interval in milliseconds that handler can be throttled on. (debounced)
 */
log.addEventHandler = function(eventLabel, handler, options) {

};

// Pub/Sub API example:

// components can react to application events
function handler(event, details) {
  console.log(event, details)
}
log.addEventHandler('EVENT_LABEL', handler);

log('EVENT_LABEL', {age:600})
// ==== output =====:
// 'EVENT_LABEL' {age:600}



// === Goal Logging API: ==========


/**
 * Sets the log context details with the goalDetails and returns the goalDetails object
 * with the "log" property set to the new log context so that the logs can be associated
 * with the goal.
 *
 * @param goalName  A name for the goal which serves as the "goal type" for querying purposes.
 * @param goalDetails.goalId  A unique identifier for this goal
 *
 * @example var goal = log.goal(goalName, {goalId: 'fileNameToBeProcessed'})
 * TODO: goalId needs to be a GUID if it is not supplied by the user.
 */
log.goal = function(goalName, goalDetails) {

};

/**
 * Logs a failed goal which saves it in a seperate, queryable goal tracking area.  (Failed goals are in there own table/log file)
 * Failed goals are otherwise known as "incomplete goals".
 *
 * Logs the error.  Throws the error.  If it is a goal, it fails the goal.
 *
 * @param goalDetails
 * @example method().catch(log.fail)
 *
 * TODO: implement
 */
log.fail = function(errReport) {

};

// Same as fail, but does not throw.
// TODO: implement
log.failSuppressed = function(errReport) {

};

/**
 * Returns a function which takes as the first param an error or ErrorReport
 * Logs error information and rejects with the errCode specified in the errorReport
 *
 * @param errCode
 *
 * @example method().catch(log.rejectWithCode('ERROR_CODE'))
 * TODO: implement
 */
log.rejectWithCode = function(errCode) {
  return function(err) {

  }
};





// NOT MVP:




// NON FUNCTIONAL REQUIREMENT:
// (Events must each be given an ascending id to order by.)

// avoid an api that takes a timestamp generated by the client.

// =========  Log Viewing API: ================
/**
 * Query the tracked events.  It treats the log database as one cohesive unit and uses the local logs
 * if it has them.  If it needs to get more logs than are available locally, it will reach out to the cloud.  After fetching
 * these logs from the cloud, it will store them locally (unless it has already maxed out its local log rotation).
 *
 * @note Ignore the requirement of querying locally for now.  Querying should only be implemented on the backend side (since implementing it
 * locally would mean rewriting the logic in lodash)
 *
 * @params params.sinceThisManySecondsAgo
 * @params params.sinceThisManyEventsAgo  Zero would be get the latest events please.
 * @params params.sinceThisEvent Event id to retrieve events afterwards.  (Events must each be given an ascending id to order by.)
 * @params params.limit  Limit the amount of events to this number
 * @params params.minimumLogLevel  Events with a log level greater to or equal this minimum value will work.  Valid values are: 'debug,info,warn,error,critical'
 * @params params.logLevel  Only events will be returned of this log level.  'debug,info,warn,error,critical'  In that order lowest-to-highest.
 * @params params.indexExpression  Ex. 'index > 5'
 * @params params.eventLabel The event label must equal this value.
 */
log.queryEvents = function(params) {

};

/**
 * Retrieves the latest events from the logs.  It treats the log database as one cohesive unit and uses the local logs
 * if it has them.  If it needs to get more logs than are available locally, it will reach out to the cloud.  After fetching
 * these logs from the cloud, it will store them locally (unless it has already maxed out its local log rotation).
 *
 * @params params.sinceThisEvent Event id to retrieve events afterwards.  (Events must each be given an ascending id to order by.)
 * @params params.limit  Limit the amount of events to this number
 * @params params.logTypes  Valid values: 'Error, Info, Event'
 */
log.getLogs = function(params) {

}



// =========  Log Viewing API Example: ================

log.getLogs({sinceThisEvent:'event-id0001', limit:100, orderBy})

// Tracked Event Query API example:

log.query({
  event: '@POWER_OUTAGE',
  before: epoch_timestamp,
  limit: 10
})

log.query({
  event: '@DATA_LOSS',
  index: 'type7'
})


// NOT MVP:

/**
 * Possibly replaceable by log.queryEvent
 *
 * @param params
 */
log.queryGoals = function(params) {

};


// === Goal Logging API Example: ==========
var goal = log.goal({goalName: 'MyGoal', goalId: 'xyz'})
log.failedGoal({ goalName: 'DeleteFolder', goalId: 'uniqueInstanceId', details: {} })  // details optional
log.failedGoal(goal)  // same as above but demonstrates the purpose of createGoal()
goal.log('EVENT', details)  // log some details which will get tracked with the goal itself.
log.completedGoal(goal)
log.listGoals({timestamp:0, limit:100, goalName: '', goalId: '', completed: false})
