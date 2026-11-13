# flowable-cmmn-moddle

[![npm version](https://badge.fury.io/js/flowable-cmmn-moddle.svg)](https://badge.fury.io/js/flowable-cmmn-moddle)
[![CI](https://github.com/jylups/flowable-cmmn-moddle/actions/workflows/ci.yml/badge.svg)](https://github.com/jylups/flowable-cmmn-moddle/actions/workflows/ci.yml)

Flowable moddle extensions for CMMN 1.1. This package provides Flowable-specific extensions for [cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle), enabling support for Flowable's custom CMMN elements and attributes in [cmmn-js](https://github.com/bpmn-io/cmmn-js) based applications.

## Installation

```bash
npm install flowable-cmmn-moddle
```

## Usage

### With cmmn-js

```javascript
import CmmnModeler from 'cmmn-js/lib/Modeler';
import flowableDescriptor from 'flowable-cmmn-moddle/resources/flowable';

const modeler = new CmmnModeler({
  container: '#canvas',
  moddleExtensions: {
    flowable: flowableDescriptor
  }
});
```

### With cmmn-js Properties Panel

```javascript
import CmmnModeler from 'cmmn-js/lib/Modeler';
import propertiesPanelModule from 'cmmn-js-properties-panel-flowable';
import propertiesProviderModule from 'cmmn-js-properties-panel-flowable/lib/provider/flowable';
import flowableDescriptor from 'flowable-cmmn-moddle/resources/flowable';

const modeler = new CmmnModeler({
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties-panel'
  },
  additionalModules: [
    propertiesPanelModule,
    propertiesProviderModule
  ],
  moddleExtensions: {
    flowable: flowableDescriptor
  }
});
```

## Supported Flowable Extensions

This package extends the CMMN 1.1 meta-model with Flowable-specific elements and attributes:

### Case Elements
- `flowable:historyTimeToLive` - Set history time to live for cases
- `flowable:initiatorVariableName` - Define initiator variable name
- `flowable:candidateStarterGroups` - Set candidate starter groups

### Human Tasks
- `flowable:assignee` - Task assignee
- `flowable:candidateUsers` - Candidate users
- `flowable:candidateGroups` - Candidate groups
- `flowable:dueDate` - Task due date
- `flowable:followUpDate` - Task follow-up date
- `flowable:priority` - Task priority
- `flowable:formKey` - Associated form key
- `flowable:formFieldValidation` - Form field validation

### Process Tasks
- `flowable:processBinding` - Process binding type
- `flowable:processVersion` - Process version
- `flowable:processTenantId` - Process tenant ID
- `flowable:fallbackToDefaultTenant` - Fallback to default tenant
- `flowable:sameDeployment` - Use same deployment

### Case Tasks
- `flowable:caseBinding` - Case binding type
- `flowable:caseVersion` - Case version
- `flowable:caseTenantId` - Case tenant ID

### Decision Tasks
- `flowable:decisionBinding` - Decision binding type
- `flowable:decisionVersion` - Decision version
- `flowable:decisionTenantId` - Decision tenant ID
- `flowable:mapDecisionResult` - Result mapping
- `flowable:resultVariable` - Result variable

### Listeners
- `flowable:caseExecutionListener` - Case execution listeners
- `flowable:taskListener` - Task listeners  
- `flowable:variableListener` - Variable listeners

### Variable Mapping
- `flowable:in` - Input variable mapping
- `flowable:out` - Output variable mapping

### Repetition Rules
- `flowable:repeatOnStandardEvent` - Repeat on standard event
- `flowable:counterVariable` - Counter variable
- `flowable:maxInstanceCount` - Maximum instance count

### Milestones
- `flowable:milestoneVariable` - Milestone variable

## CMMN XML Namespace

This extension uses the namespace `http://flowable.org/cmmn` with the prefix `flowable:`.

Example CMMN XML with Flowable extensions:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL"
             xmlns:flowable="http://flowable.org/cmmn"
             targetNamespace="http://flowable.org/cmmn">
  <case id="myCase" flowable:initiatorVariableName="initiator">
    <casePlanModel id="casePlanModel" flowable:formKey="startForm">
      <planItem id="humanTaskPlan" definitionRef="humanTask"/>
      <humanTask id="humanTask" 
                 flowable:assignee="${initiator}"
                 flowable:candidateGroups="managers"
                 flowable:formKey="taskForm"/>
    </casePlanModel>
  </case>
</definitions>
```

## Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup
```bash
git clone https://github.com/jylups/flowable-cmmn-moddle.git
cd flowable-cmmn-moddle
npm install
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Load-and-save report

Checks which parts of real Flowable models survive loading and saving with
this descriptor. It runs over the CMMN models in the
[Flowable engine](https://github.com/flowable/flowable-engine) repository
(Apache-2.0) and the full documents in `test/fixtures/xml`:

```bash
npm run roundtrip:fetch   # sparse checkout of the Flowable models into .flowable-models
npm run roundtrip         # writes roundtrip-report.md and roundtrip-report.json
```

Each model is imported with cmmn-moddle and this descriptor, exported again,
and both XML documents are compared as namespace-resolved trees. Namespace
prefixes, element order, whitespace, number formatting and attributes that
hold their default value are not reported. Differences are grouped by kind,
for example `dropped-element cmmn:extensionElements > flowable:eventType`.

`test/roundtrip/known-losses.json` lists the known differences, each with the
issue that tracks it. The report exits with 1 when it finds a difference that
is not in that list, so CI catches new losses. When a loss is fixed, the
report lists it under "No longer found"; remove it from the list, or run
`npm run roundtrip -- --update-baseline` to rewrite the list (issue links of
remaining entries are kept). Set `FLOWABLE_ENGINE_REF` to fetch the models of
another Flowable commit.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [cmmn-js](https://github.com/bpmn-io/cmmn-js) - CMMN 1.1 modeling for the web
- [cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle) - CMMN 1.1 meta-model
- [Flowable](https://github.com/flowable/flowable-engine) - Open source business process engine

## Acknowledgments

- Based on [camunda-cmmn-moddle](https://github.com/camunda/camunda-cmmn-moddle)
- Built on top of the excellent [bpmn.io](https://bpmn.io) toolkit
