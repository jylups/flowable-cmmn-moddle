const CmmnModdle = require('cmmn-moddle').default;

// Test with minimal descriptor
const simpleDescriptor = {
  "name": "Flowable",
  "uri": "http://flowable.org/cmmn",
  "prefix": "flowable",
  "xml": {
    "tagAlias": "lowerCase"
  },
  "associations": [],
  "types": [
    {
      "name": "Assignable",
      "extends": [ "cmmn:HumanTask" ],
      "properties": [
        {
          "name": "assignee",
          "isAttr": true,
          "type": "String"
        }
      ]
    }
  ],
  "enumerations": [ ]
};

console.log('Testing simple descriptor...');

try {
  console.log('Creating CmmnModdle instance...');
  const moddle = new CmmnModdle({
    flowable: simpleDescriptor
  });
  console.log('Success! Simple descriptor worked.');
  
  const humanTask = moddle.create('cmmn:HumanTask');
  console.log('HumanTask created:', humanTask.$instanceOf('flowable:Assignable'));
} catch (error) {
  console.error('Error with simple descriptor:', error.message);
}