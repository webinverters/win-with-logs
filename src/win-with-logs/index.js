var winWithLogs_api = require('../api/win-with-logs-api')

module.exports = function (config) {
  var loggerInstance = new winWithLogs_api(config);
  return loggerInstance;
};