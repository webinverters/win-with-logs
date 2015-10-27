var p = require('bluebird');
var _ = require('lodash');


//Providers
var BunyanProvider = require('../providers/bunyan');
var PubSub = require('../providers/pub-sub');
var FsProvider = require('../providers/fs');


//Types
var finalType = require('./final-type');
var Transport = finalType.Transport
var Api = require('./final-api').Api;


/**
 * handles the logic of configs.
 * @param config
 * @returns {*}
 */
function apiFactory(config) {

  var apiInstance;

  //check for basic params and new up bunyan Provider

  if (typeof config.app !== "string") throw new Error("invalid param");
  if (typeof config.env !== "string") throw new Error("invalid param");
  if (typeof config.component !== "string" && typeof config.name !== "string") throw new Error("invalid param");
  if (typeof config.silent !== "boolean") throw new Error("invalid param");
  if (typeof config.debug !== "boolean") throw new Error("invalid param");
  if (typeof config.isNode !== "boolean") throw new Error("invalid param");

  config.component = config.component || config.name

  var bunyanTemp = new BunyanProvider(config);
  var pubSubTemp = new PubSub(config);


  apiInstance = Api(bunyanTemp, pubSubTemp);

  Transport.addAction.call(apiInstance, "trace", function (a) {
    if (typeof a.msg == "string" && a.msg[0] == "@") {
      pubSubTemp.handleEvent(a.msg)
    }
  });

  if (!config.app) throw "Can't win with logs if you dont specify 'app' in the config"
  if (!config.env) throw "Can't win with logs if you dont specify 'env' in the config"
  if (!config.component) throw "Can't win with logs if you dont specify 'component' in the config"


  if (config.debug == true) console.log("Debug Logging Enabled");

  //add prettified logging to the console by default if we are using node
  if (config.silent == false && config.isNode == true) {
    var PrettyStream = require('bunyan-prettystream');
    var prettyStdOut = new PrettyStream();
    prettyStdOut.pipe(process.stdout);
    Transport.addAction.call(apiInstance, "trace", function (a) {
      prettyStdOut.write(a.logObject);
    });
  }

  //add console.log by default if we are using a browser
  if (config.silent == false && config.isNode == false) {
    Transport.addAction.call(apiInstance, "trace", function (a) {
      console.log.call(console, a.logString)
    });
  }

  if (config.robustKey || config.cloudConfig) {
    if (typeof config.robustKey !== "string") throw new Error("invalid param");
    if (typeof config.cloudConfig !== "object") throw new Error("invalid param");
  }

  if (config.streams) {
    if (typeof config.streams !== "object" || typeof config.streams.length !== "number") throw new Error("invalid params");
    _.forEach(config.streams, function (value) {
      if (value.logFileName || value.logFilePath || value.maxLogFileSize || value.maxLogFiles) {
        var fsInstance = new FsProvider(value);
        Transport.addAction.call(apiInstance, "trace", function (a) {
          fsInstance.write(a.logString);
        });
      }
    });
  }

  return apiInstance
}


module.exports = apiFactory;
