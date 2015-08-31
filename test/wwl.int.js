/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-08-30.
 * @license Apache-2.0
 */

"use strict";

var ModuleUnderTest = require('../index');

describe('wwl', function () {
  var log;

  beforeEach(function () {
    log = ModuleUnderTest({enableTrackedEvents: false, debug: true, app: 'wwl-int-test', name: 'wwl-int-test', env: 'test'})
  });

  describe('log()', function() {
    it('logs the msg and details.', function() {
      log('dynamo.insert()', {
        table: 'tableName',
        params: {insert: 'xyz', double: 10.001, nested: { x: 10 } }
      });
    })
  })
});