const CmmnModdle = require('cmmn-moddle').default;

console.log('Finding available CMMN types...');

try {
  const moddle = new CmmnModdle();
  
  // Get the registry to see what types are available
  const registry = moddle.registry;
  const typeMap = registry.typeMap;
  
  console.log('\nAvailable CMMN types:');
  Object.keys(typeMap).forEach(key => {
    if (key.startsWith('cmmn:')) {
      console.log(`  ${key}`);
    }
  });
  
  // Look specifically for Plan-related types
  console.log('\nPlan-related types:');
  Object.keys(typeMap).forEach(key => {
    if (key.toLowerCase().includes('plan')) {
      console.log(`  ${key}`);
    }
  });
  
} catch (error) {
  console.error('Error:', error.message);
}