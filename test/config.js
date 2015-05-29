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


