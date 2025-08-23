# flowable-cmmn-moddle

[![Build Status](https://travis-ci.com/jylups/flowable-cmmn-moddle.svg?branch=master)](https://travis-ci.com/jylups/flowable-cmmn-moddle)

This project defines the [Flowable](https://flowable.org) namespace extensions for CMMN 1.1 as a [moddle](https://github.com/bpmn-io/moddle) descriptor.


## Usage

Use it together with [cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle) to validate Flowable CMMN 1.1 extensions.

```javascript
var CmmnModdle = require('cmmn-moddle');

var flowableModdle = require('flowable-cmmn-moddle/resources/flowable');

var moddle = new CmmnModdle({ flowable: flowableModdle });

var humanTask = moddle.create('cmmn:HumanTask', {
  'assignee': 'foo'
});
```


## Building the Project

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

Execute the test via

```
npm test
```

Perform a complete build of the library via

```
npm run all
```


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
