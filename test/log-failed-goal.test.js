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

var log = require('../index')({
  name: 'test',
  env: 'dev',
  app: 'test-goal-logging'
  //enableTrackedEvents: false
});

return log.error('@FAILED_TODO_SOMETHING', {info: 'additional info', uid:'unique-goal-identifier-'+new Date().getTime()});
//.then(function(result) {
//    console.log('Success:', result);
//  })
//.catch(function(err) {
//    console.log('Error: ',err);
//  });