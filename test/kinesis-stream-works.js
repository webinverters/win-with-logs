///**
// * @module myModule
// * @summary: This module's purpose is to:
// *
// * @description:
// *
// * Author: Justin Mooser
// * Created On: 2015-05-23.
// * @license Apache-2.0
// */
//
//"use strict";
//
//var kinesis = require('kinesis')
//
//
//var fs = require('fs'),
//  Transform = require('stream').Transform,
//  kinesis = require('kinesis'),
//  KinesisStream = kinesis.KinesisStream;
//
//// Uses credentials from process.env by default
//
////kinesis.listStreams({region: 'us-west-1'}, function(err, streams) {
////  if (err) throw err
////
////  console.log(streams)
////  // ["http-logs", "click-logs"]
////})
////
////
////var kinesisSink = kinesis.stream('http-logs')
////// OR new KinesisStream('http-logs')
////
////fs.createReadStream('http.log').pipe(kinesisSink)
////
////
////var kinesisSource = kinesis.stream({name: 'click-logs', oldest: true})
////
////// Data is retrieved as Record objects, so let's transform into Buffers
////var bufferify = new Transform({objectMode: true})
////bufferify._transform = function(record, encoding, cb) {
////  cb(null, record.Data)
////}
////
////kinesisSource.pipe(bufferify).pipe(fs.createWriteStream('click.log'))
//
//
//// Create a new Kinesis stream using the raw API
////kinesis.request('CreateStream', {StreamName: 'test', ShardCount: 2}, function(err) {
////  if (err) throw err;
////
////  kinesis.request('DescribeStream', {StreamName: 'test'}, function(err, data) {
////    if (err) throw err;
////
////    console.dir(data);
////
////    kinesis.listStreams({host: 'localhost', port: 4567}, console.log);
////  });
////});
//
//
//kinesis.stream('http-logs');
//
//kinesis.request('DescribeStream', {StreamName: 'test'}, function(err, data) {
//  if (err) throw err;
//
//  console.dir(data);
//
//  kinesis.listStreams({}, console.log);
//});
//
//
//// All events have:
//var event = {
//  label: '',
//  details: {
//    timestamp: 1212121212,
//    value: 1
//  },
//  msg: '',
//  comboId: 0,
//  sentEpoch: 123123212,
//  queuedEpoch: 121212112
//};
//
//
//
//
//
