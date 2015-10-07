//this is to help with readability when profiling objects.
function providers() {};
var m = new providers;

m.bunyan = require('./bunyan');


module.exports = m;