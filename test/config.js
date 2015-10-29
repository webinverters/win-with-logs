/**
 * Created by justin on 2015-03-13.
 */
global.chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

global._ = require('lodash');
global.p = require('bluebird');
global.path = require('path');
global.util = require('util');

global.sinon = require("sinon");
global.sinonChai = require("sinon-chai");
global.sinonAsPromised = require('sinon-as-promised')(p);

var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.config.includeStack = true;

global.expect = chai.expect;

require('dotenv').load();
global.config = {};
config.secrets = {
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  ROBUST_KEY: process.env.ROBUST_KEY
};

global.AWS = require('aws-sdk');

config.aws ={
  region: "us-east-1",
  apiVersion: "2012-08-10",
  accessKeyId: config.secrets.AWS_KEY,
  secretAccessKey: config.secrets.AWS_SECRET
};

AWS.config.update(config.aws);

global.throwEx = function(msg) {
  throw new Error(msg)
}
