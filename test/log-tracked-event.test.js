/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-05-23.
 * @license Apache-2.0
 */

"use strict";

require('./config');

var logger = require('../index')({
  enableTrackedEvents: true,
  enableEventBroadcaster: true,
  winWithLogsKey: '',
  winWithLogsSecret: ''
});

logger.log('@TrackedEvent', {details: 'info'});


