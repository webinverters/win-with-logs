/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-09-02.
 * @license Apache-2.0
 */

"use strict";

module.exports = function construct(config, log) {
  //log.module('robust-client', {log: log})
  var m = new (function RobustClient() {
  })();

  config = config ? config : {};
  config = _.defaults(config, {
    cloudLogServerEndpoint: '',
    robustKey: ''
  });

  var http = p.promisifyAll(require('resilient')({}))

  var options = {
    headers: {
      'RobustKey': config.robustKey
    }
  }

  m.postLogEvents = function(logEvents) {
    options.data = logEvents
    return http.postAsync(config.cloudLogServerEndpoint, options)
  };

  m.getLogs = function(filters) {
    if (filters.event) throw "log.getLogs() cannot query for a specific event type.  Use log.query for that and ensure the event is indexed."
    options.params = filters
    return http.getAsync(config.cloudLogServerEndpoint, options)
  };

  return m;
};