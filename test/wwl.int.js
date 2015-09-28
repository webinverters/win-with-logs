// /**
//  * @module myModule
//  * @summary: This module's purpose is to:
//  *
//  * @description:
//  *
//  * Author: Justin Mooser
//  * Created On: 2015-08-30.
//  * @license Apache-2.0
//  */
//
// "use strict";
//
// var ModuleUnderTest = require('../index');
//
// describe('wwl', function () {
//   var log, cb=function(){};
//
//   beforeEach(function () {
//     log = ModuleUnderTest({app: 'wwl', name: 'wwl.int.js', env: 'test',
//       streams:[
//         {
//           level: 'trace',
//           type: 'raw',
//           stream: require('./helpers/test-stream')(config, function(chunk, encoding, done) {
//             cb(chunk,encoding);
//           })
//         }]})
//   });
//
//   describe('log()', function() {
//     it('logs the msg and details.', function(done) {
//       cb = function(chunk, encoding) {
//         expect(chunk.details.table).to.equal('tableName')
//         expect(chunk.details.params).to.deep.equal({insert: 'xyz', double: 10.001, nested: { x: 10 } })
//         expect(chunk.level).to.equal(30)  // info is level 30
//         done()
//       };
//
//       log('method()', {
//         table: 'tableName',
//         params: {insert: 'xyz', double: 10.001, nested: { x: 10 } }
//       });
//     })
//   })
//
//   describe('log.error()', function() {
//     xit('logs the error details and stack trace', function() {
//       log.error('error occurred:', new Error('test error'));
//       throw "fails"
//     })
//     it('logs the error string', function() {
//       log.error('error occurred:', 'some error info');
//     })
//   })
//
//   describe('config.robustKey is valid', function() {
//     beforeEach(function() {
//       log = ModuleUnderTest({app: 'wwl', name: 'wwl.int.js', env: 'test', robustKey: config.secrets.ROBUST_KEY})
//     })
//     it('posts events to cloud', function() {
//       log('test event', {info: 'very important'})
//       return p.resolve()
//         .delay(10000)
//         .then(function() {
//           // get the latest 100 log items (both indexed and unindexed)
//           return log.getLogs({timestamp:0, limit:100, destruct: true})
//         })
//         .then(function(logs) {
//           expect(logs[0]).to.deep.equal(chai.match({msg:'test event', details: {info: 'very important'}}))
//         })
//     })
//
//     xdescribe('if cloud has indicated quota is exceeded', function() {
//       it('client will implement log throttling client-side to save the server bandwidth cost.', function() {
//
//       })
//     })
//
//     xdescribe('log.query()', function() {
//       it('can query indexed events', function() {
//         log('@INDEXED_EVENT', {name: 'justin'})
//         return p.resolve()
//           .delay(10000)// give Robust-Logs a chance to index the event.
//           .then(function() {
//             return log.query({event:'INDEXED_EVENT', destruct: true}) // destruct parameter deletes the event from Robust-Log
//           })
//           .then(function(results) {
//             expect(results[0]).to.equal(chai.match({
//               eventLabel: 'INDEXED_EVENT', details: { name: 'justin' }
//             }))
//           })
//       })
//
//       it('can not query non-indexed events', function() {
//         return log('INDEXED_EVENT', {name: 'justin'})
//           .delay(10000)// give Robust-Logs a chance to index the event.
//           .then(function() {
//             return log.query({event:'INDEXED_EVENT', destruct: true})
//           })
//           .then(function(results) {
//             expect(results.length).to.equal(0)
//           })
//       })
//       it('can query with conditions on numValue')
//       it('can query with conditions on stringValue')
//     })
//   })
//
//
//
//   xdescribe('context()', function() {
//     it('resolves with context info', function() {
//       log.context('test()', {0:'hello'})
//       log.resolve('result')
//     })
//   })
// });
