var _ = require('lodash'),
   p = require('bluebird'),
   Promise = p

module.exports = function(config) {
  var m = new GoalTrackingPlugin(),
      fs = require('fs'),
      util = require('util'),
      path = require('path'),
      conf = config.plugins.goalTracking
  
  conf = _.defaults(conf, {
    intervalInSeconds: 30,
    dir: 'goal-tracking'
  })
  
  if (!fs.existsSync(conf.dir)){
    console.log('making goal tracking dir...')
    fs.mkdirSync(path.join(process.cwd(),conf.dir))
  }
  
  var stats = {}
  // TODO: load stats from file for today.
  
  var statsFilePath = path.join(process.cwd(),conf.dir, 'stats'+getDate()+'.json')
  console.log('Stats File: ', statsFilePath)
  
  console.log('Loading todays goal stats...')
  try {
    var statsObj = fs.readFileSync(statsFilePath, 'utf-8')
    console.log('read stats file', statsObj)
    if (statsObj) stats = JSON.parse(statsObj)
    console.log('stats set to', stats)
  } catch (ex) {console.log(ex)}

  
  setInterval(()=>{
    fs.writeFile(statsFilePath, JSON.stringify(stats,null, '\t'), 'utf-8')
  }, conf.intervalInSeconds*1000)

  m.process = function(logEvent) {
    if (logEvent._tags && logEvent._tags.indexOf('GOAL-COMPLETE') >=0) {
      console.log('GoalTracking:processing...', logEvent)
      
      if (!logEvent.goalReport) throw new Error('ASSERT: event tagged with GOAL-COMPLETE should have a goal report.')
      if (!logEvent.chain) throw new Error('ASSERT:logger: event tagged with GOAL-COMPLETE should have a chain.')
      
      var stat = stats[logEvent.chain] = stats[logEvent.chain] || {
           name: logEvent.goalReport.goalName,
           module: logEvent.chain,
           type: logEvent.goalReport.type,
           count: 0,
           avgDuration: 0,
           fastest: 99999999,
           slowest: -1,
           failCount: 0
        }
      
      stat.count += 1,
      stat.avgDuration += ((logEvent.goalDuration - stat.avgDuration) / stat.count)
      stat.slowest = _.max([stat.slowest, logEvent.goalDuration])
      stat.fastest = _.min([stat.fastest, logEvent.goalDuration])
      if (logEvent.goalReport.status != 'SUCCEEDED')
        stat.failCount += 1
    }
  }

  return m
}

function GoalTrackingPlugin() {  }

function getDate() {
  var dt = new Date();
  return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate()
}