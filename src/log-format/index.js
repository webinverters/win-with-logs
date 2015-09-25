var Bunyan = require('bunyan');



/**
 * this handles the bunyan parsing
 * @param _config -takes in a config
 * @param func output - function to get called with the output.
 * @returns {*} bunyan -returns a bunyan instance.
 */
module.exports=function (_config, func) {


//default bunyan config
  var config = {
    module: "",
    name: '',
    streams: [
      {
        level: 'debug',
        stream: {
          write: func
        },
        type: 'raw'
      }
    ]
  };

  config.maxLogFileSize=_config.maxLogFileSize;
  config.name=_config.app;
  config.component=_config.component;
  config.env=_config.env;

  return Bunyan(config)
};