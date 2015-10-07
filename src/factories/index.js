function factories() {};
var m = new factories;
m.loggerApi = require('./logger-api');
m.goalApi = require('./goal-api');
m.pubSub = require('./pub-sub');
module.exports = m;