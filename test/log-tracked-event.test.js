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
  name: 'webservice',
  env: 'dev',
  app: 'test-app'
  //enableTrackedEvents: false
});

logger.log('@USAGE_LEVEL', {superdate: 'sumptuous', valueInt: 10, valueStr: 'whatever'});
logger.log('Here is a logged message');
logger.error('@FAILED_TO_SEND_EMAIL', {info: 'additional info'});
//logger.log('@STARTING', 12, 24);