'use strict';

var fs = require('fs');


function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

module.exports.readFile = readFile;


var CmmnModdle = require('@jylups/cmmn-moddle').default;

var flowableDescriptor = require('../resources/flowable');

function createModdle() {
  return new CmmnModdle({
    flowable: flowableDescriptor
  });
}

module.exports.createModdle = createModdle;


/**
 * Imports XML with the Promise based API of cmmn-moddle. Resolves with
 * { error, rootElement, warnings } whether or not the import fails, because
 * a failed import rejects with an error that carries the warnings.
 *
 * @param {CmmnModdle} moddle
 * @param {string} xml
 * @param {string} typeName
 *
 * @return {Promise<Object>}
 */
function importXML(moddle, xml, typeName) {
  return moddle.fromXML(xml, typeName).then(function(result) {
    return {
      error: null,
      rootElement: result.rootElement,
      warnings: result.warnings
    };
  }, function(error) {
    return {
      error: error,
      rootElement: null,
      warnings: error.warnings || []
    };
  });
}

module.exports.importXML = importXML;
