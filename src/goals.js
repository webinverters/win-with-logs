/**
 * @module goal-logger
 * @summary: This module's purpose is to log and track goals.
 *
 * @description: Goals are aka phases of various execution in a program, generally
 * characterized by some end-goal (or purpose).
 *
 * Author: Justin Mooser
 * Created On: 2015-09-02.
 * @license Apache-2.0
 */

"use strict";

// goal('funcName',
//       {user: user, quotaRequest: quotaRequest},
//       {track:true,expireSecs:86400,retry:5,alertGroup:'annoying',retryBackoffFactor:1000})

function GoalLogger(){}
module.exports = function construct(config, log) {
  var m = new GoalLogger();

  config = config ? config : {};
  config = _.defaults(config, {

  });

  /**
   * Log and create a goal which can optionally be tracked, alerted, or
   * retried (in certain cases).
   *
   * @param  {[type]} goalName  [description]
   * @param  {[type]} paramData [description]
   * @param  {bool} options.track   If true, will appear in the "failed goals" dashboard view.
   * @param  {bool} options.expireSecs   The seconds to wait before deleting this from the tracked goals.  0 = never expire.
   * @param  {Number} options.retry   Seconds to wait before retrying again (retry period).  Or a string "exponential" to use exponential backoff retry algorithm.
   * @param  {string} options.alert   Name of the alert to send if this fails.
   * @param  {string} options.alertOnlyIfRetryFails  Only send the alert if the retry fails.
   * @return {goal}   A goal logger instance
   */
  m.goal = function(goalName, paramData, options) {

    return _.extend({},log, {complete:function() {}, fail: function() {}})
  }
}

// Example Use Case:
function doStuff(user, data) {
  // it is important to never fail to release a users quota.
  var goal = log.goal('doStuff',
    {user: user, data:data},
    {track:true,expireSecs:0,retry:'exponential',alert:'backendFailure',alertOnlyIfRetryFails: true})

  return doCrazyStuff(goal) // can optionally pass the goal around so other parts can log to the goal.
  .then(function() {
    goal.log('Finished doCrazyStuff()')
  })
  .then(goal.complete)
  .catch(goal.fail)
}
