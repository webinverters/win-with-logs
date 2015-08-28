/**
 * @module myModule
 * @summary: This module's purpose is to:
 *
 * @description:
 *
 * Author: Justin Mooser
 * Created On: 2015-08-26.
 * @license Apache-2.0
 */

"use strict";

require('dotenv').load();

var p = require('bluebird'),
  _ = require('lodash');

module.exports = function construct(env, app) {
  var m = new (function Init() {
  })();

  var config = require('./config')(env,app)
  config = _.defaults(config, {
    aws: {
      region: "us-east-1",
      //apiVersion: "2012-08-10",
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET
      //,sslEnabled: false,
      //endpoint: 'localhost:4567'
    }
  });

  var log = require('./index')({debug: true, enableTrackedEvents: false, app: 'wwl-init', env: 'init', name: 'init'});
  global.AWS = require("aws-sdk")
  AWS.config.update(config.aws);
  var dynamo = require('dynamo-data-api')(config,log)

  var tableSpecs = [
    {
      tableName: config.TABLE_EVENTS,
      keySchema: [{name: 'key', type: 'S', keyType: 'HASH'},{name: 'timestamp', type:'N', keyType: 'RANGE'}],
      writeUnits: 30,
      readUnits: 30
    },
    {
      tableName: config.TABLE_ERRORS,
      keySchema: [{name: 'key', type: 'S', keyType: 'HASH'},{name: 'timestamp', type:'N', keyType: 'RANGE'}],
      writeUnits: 2,
      readUnits: 2
    },
    {
      tableName: config.TABLE_FAILED_GOALS,
      keySchema: [{name: 'name', type: 'S', keyType: 'HASH'},{name: 'uid', type:'S', keyType: 'RANGE'}],
      writeUnits: 2,
      readUnits: 2
    }
  ];

  return p.map(tableSpecs, function(spec) {
    return dynamo.seedTable(spec, spec.seedData)
  })
  .then(function() {
    console.log('success');
  })
  .catch(function(err) {
    console.log(err);
  });

  return m;
};

if (!module.parent) {
  console.log('Usage: node init <env> [<app>]');
  console.log('env:',process.argv[2], process.argv[3]);
  module.exports(process.argv[2], process.argv[3] || 'wwl')
}