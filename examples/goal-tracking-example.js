var p = require('bluebird')
var log = require('../index')({
  env: 'example',
  app: 'example',
  component: 'example',
  debug: false,
  plugins: {
    goalTracking: {
      intervalInSeconds: 2
    }
  }
})

var iterations = 20

setInterval(()=>{
  iterations--;
  if (iterations < 0) process.exit(0)
  
  var goal = log.goal('example:goal')

  p.resolve().delay(Math.random()*10)
    .then(()=> {
      goal.pass('m0ser')
    })
}, 500)
  

setInterval(()=>{
  iterations--;
  if (iterations < 0) process.exit(0)
  
  var goal = log.method('longOperation()')

  p.resolve().delay(Math.random()*100)
    .then(()=> {
      goal.pass('m0ser')
    })
}, 500)