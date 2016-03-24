/**
* @Author: Robustly.io <Auto>
* @Date:   2016-03-17T00:23:08-04:00
* @Email:  m0ser@robustly.io
* @Last modified by:   Auto
* @Last modified time: 2016-03-18T00:23:04-04:00
* @License: Apache-2.0
*/



/**
 * @module loggly-plugin
 * @summary:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-10-28.
 * @license Apache-2.0
 */

module.exports = function(config, axios) {
  var m = new LogglyPlugin()

  config.plugins.loggly.baseURL = config.plugins.loggly.baseURL || 'https://logs-01.loggly.com/inputs/'

  debug('Loggly Plugin Config:', config)
  var _tags = config.app + '-' + config.env
  if (config.plugins.loggly.tags) {
    _tags += ','+config.plugins.loggly.tags
  }

  debug('_tags:', _tags)

  var axiosConfig = {
    baseURL: config.plugins.loggly.baseURL + config.plugins.loggly.token,
    //timeout: 1000,
    headers: {
      'X-LOGGLY-TAG': _tags,
      'content-type': 'text/plain'
    }
  }

  var http = axios.create(axiosConfig)
  var queryEndpoint = axios.create({
    auth: {
      username: config.plugins.loggly.user,
      password: config.plugins.loggly.password
    },
    baseURL: config.plugins.loggly.baseURL
  })

  m.send = function(logEvent) {
    debug('converting log event to json')
    var json = JSON.parse(logEvent.toString())
    json.timestamp = json.time
    delete json.time
    debug('result json:', json)

    return http.post('/', json)
      .then(function(res) {
        debug('BOOYEAH', res)
      })
      .catch(function(err) {
        debug('Failed to send logs:', err)
        console.log('Missed:', logEvent.toString())
      })
  }

/**
 * q	required	query string, check out the Search Query help

   params.from	optional	Start time for the search. Defaults to “-24h”.
    (See valid time parameters.)
   params.until	optional	End time for the search. Defaults to “now”.
(See valid time parameters.)
  params.order	optional	Direction of results returned, either “asc” or “desc”. Defaults to “desc”.
  params.size	optional	Number of rows returned by search. Defaults to 50.
 * @param  {[type]} q      [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
  m.query = function(q, params) {
    debug('staring query', q, params)
    return queryEndpoint.get('search?q="'+q+'"')
      .then(function(res) {
        debug('received result:', res)
        return res.data.rsid
      })
      .delay(5000)
      .then(function(rsid) {
        debug('rsid=',rsid)
        return queryEndpoint.get('events?rsid='+rsid.id)
      })
      .then(function(results) {
        debug('log.query results:', results)
        return results.data.events
      })
  }

  return m
}

function LogglyPlugin() {  }
