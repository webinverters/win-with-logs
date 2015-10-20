var p = require('bluebird');
var _ = require('lodash');

//provider requirements;
var BunyanProvider = require('../../providers/bunyan');
var PubSub = require('../../providers/pub-sub');
var FsProvider = require('../../providers/fs');


var finalType = require('./final-type');
var Transport = finalType.Transport
var Api = require('./final-api').Api;



function apiFactory(config) {

  var apiInstance;

  //check for basic params and new up bunyan Provider
  if (config.app || config.env || config.component) {
    if (typeof config.app !== "string") throw new Error("invalid param");
    if (typeof config.env !== "string") throw new Error("invalid param");
    if (typeof config.component !== "string") throw new Error("invalid param");

    var temp = new BunyanProvider(config);
    var temp2 = new PubSub(config);

    apiInstance = new Api(temp, temp2);
  } else {
    throw new Error("invalid param");
  }

  if (config.debug == true) {

  } else {

  }

  //add prettified logging to the console by default
  if (config.silent == false) {
  //if (true) {
    //add basic transports


    //we do this to avoid using pretty stream on the browser.
    if (config.isNode == true) {
      var PrettyStream = require('bunyan-prettystream');
      var prettyStdOut = new PrettyStream();
      prettyStdOut.pipe(process.stdout);
      //prettyStdOut.on('data',console.log);
      Transport.addAction.call(apiInstance, "trace", function (a) {
        prettyStdOut.write(a.logObject);
      });

    } else {
      Transport.addAction.call(apiInstance, "trace", function (a) {
        console.log.call(console,a.logString)
      });
    }


  }

  if (config.robustKey || config.cloudConfig) {
    if (typeof config.robustKey !== "string") throw new Error("invalid param");
    if (typeof config.cloudConfig !== "object") throw new Error("invalid param");
    //add cloud transports
    //add an example of cloud transports.
  }

  if (!config.streams) {
  } else {
    if (typeof config.streams !== "object" || typeof config.streams.length !== "number") throw new Error("invalid params");

    _.forEach(config.streams, function (value) {

      if(value.logFileName||value.logFilePath||value.maxLogFileSize ||value.maxLogFiles){

        var fsInstance = new FsProvider(value);
        console.log("adding new instance?")
        Transport.addAction.call(apiInstance, "trace", function (a) {
          fsInstance.write(a.logString);
        });
      }




    });
  }

  return apiInstance
}


module.exports = apiFactory;