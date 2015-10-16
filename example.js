global._ = require('lodash')
global.p = require('bluebird')

// create a wwl instance
var log = require('./index')({
  env: 'example', app: 'example', component: 'example'
})

// try out .result api.

log.result({fuck: 'fuck'})

log.error('fuck')
