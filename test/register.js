'use strict';

/* global require */

// Compiles ES module sources to CommonJS so mocha can load them: this
// package's own sources and the cmmn-moddle, moddle and moddle-xml
// dependencies, which are published as ES module source only.
//
// A file is compiled when its path has no node_modules folder, or when the
// last node_modules folder in its path holds one of those dependencies.
// (Babel runs the hook in a worker, so `only` must be a RegExp, not a function.)

var NO_NODE_MODULES = /^(?!.*[\\/]node_modules[\\/])/;

var ESM_DEPENDENCY =
  /[\\/]node_modules[\\/](cmmn-moddle|moddle|moddle-xml)[\\/](?!.*[\\/]node_modules[\\/])/;

require('@babel/register').default({
  babelrc: false,
  configFile: false,
  presets: [
    [ '@babel/preset-env', { targets: { node: 'current' } } ]
  ],
  only: [ NO_NODE_MODULES, ESM_DEPENDENCY ]
});
