angular.module('robust-logs', [])
  .factory('Log', ['config', function(config) {
    if (!window._) throw new Error('robust-logs: missing dependency "lodash"')
    if (!window.Promise) throw new Error('robust-logs: missing dependency "bluebird"')
    window.p = window.Promise
    if (!window.axios) throw new Error('robust-logs: missing dependency "axios"')
    window.debug = function() {} || window.debug || console.log.bind(console)
    return require('./src/win-with-logs')(config, window.axios)
  }])
  .factory('log', ['Log', function(Log) {
    return Log
  }])
