//this is to help with readability when profiling objects.
function providers() {};
var m = new providers;
m.bunyan = require('./bunyan');
m.fs = require('./fs');
module.exports = m;