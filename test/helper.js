'use strict';

var fs = require('fs');


function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

module.exports.readFile = readFile;


var CmmnModdle = require('cmmn-moddle').default;

var flowableDescriptor = require('../resources/flowable');

function createModdle() {
  return new CmmnModdle({
    flowable: flowableDescriptor
  });
}

module.exports.createModdle = createModdle;