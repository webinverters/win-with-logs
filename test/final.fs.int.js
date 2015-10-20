var m = require('../index')

describe('hello', function () {
  it('world', function () {

    var log = m({component: 'test', env: 'dev', app: 'testapp', debug: true,
    streams:[
      {
        logFileName:'log',
        logFilePath: './test/',
        maxLogFileSize: 100,
        maxLogFiles: 5
      }

    ]
    })
    log.log("hi")


  })
});