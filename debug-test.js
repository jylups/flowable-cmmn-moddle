const CmmnModdle = require('cmmn-moddle').default;
const flowableDescriptor = require('./resources/flowable');

console.log('Testing flowable descriptor...');
console.log('Types count:', flowableDescriptor.types.length);

// Log all type names
flowableDescriptor.types.forEach((type, index) => {
  console.log(`${index}: ${type.name} - superClass: ${JSON.stringify(type.superClass)}, extends: ${JSON.stringify(type.extends)}`);
});

try {
  console.log('Creating CmmnModdle instance...');
  const moddle = new CmmnModdle({
    flowable: flowableDescriptor
  });
  console.log('Success! CmmnModdle created.');
} catch (error) {
  console.error('Error creating CmmnModdle:', error.message);
  console.error(error.stack);
}