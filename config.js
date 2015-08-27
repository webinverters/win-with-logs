/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-08-26.
 * @license Apache-2.0
 */

"use strict";

module.exports = function construct(env, app) {
  var config = new (function Config() {
  })();

  config.TABLE_FAILED_GOALS= app + '-failed_goals-' + env,
  config.TABLE_ERRORS= app + '-error_log-' + env
  config.TABLE_EVENTS= app + '-event_log-' + env

  return config;
}