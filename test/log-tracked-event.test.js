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
  env: 'test',
  app: 'testapp',
  debug: true,
  streamName: 'Test'
  //enableTrackedEvents: false
});

//logger.log('@USAGE_LEVEL', {superdate: 'sumptuous', valueInt: 10, valueStr: 'whatever'});
//logger.log('Here is a logged message');

//logger.error('@SOMETHING_FAILED', {info: 'additional info'})
//logger.error('@SOMETHING_FAILED', {info: 'additional info', err: new Error('theerror')})


// logger('@RECV_RESPONSE', {
//   response: {status:200, body: {body:'body'}},
//   status: 'OK',
//   meterUUID: 'abcdi',
//   transactionId: 'xdjdkjfkdf',
//   request: 'holy request',
//   info: null
// })

logger('listening at http://%s:%s', 'sher', 54)
