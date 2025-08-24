const CmmnModdle = require('cmmn-moddle').default;

console.log('Testing base CMMN types...');

try {
  const moddle = new CmmnModdle();
  
  const typesToCheck = [
    'cmmn:Case',
    'cmmn:HumanTask', 
    'cmmn:CaseTask',
    'cmmn:DecisionTask',
    'cmmn:ProcessTask',
    'cmmn:RepetitionRule',
    'cmmn:Milestone',
    'cmmn:ExitCriterion',
    'cmmn:CasePlanModel'
  ];
  
  typesToCheck.forEach(type => {
    try {
      const instance = moddle.create(type);
      console.log(`✓ ${type} exists`);
    } catch (error) {
      console.log(`✗ ${type} does not exist: ${error.message}`);
    }
  });
  
} catch (error) {
  console.error('Error creating base CmmnModdle:', error.message);
}