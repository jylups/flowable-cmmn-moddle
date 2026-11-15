# flowable-cmmn-moddle

[![npm version](https://badge.fury.io/js/flowable-cmmn-moddle.svg)](https://badge.fury.io/js/flowable-cmmn-moddle)
[![CI](https://github.com/jylups/flowable-cmmn-moddle/actions/workflows/ci.yml/badge.svg)](https://github.com/jylups/flowable-cmmn-moddle/actions/workflows/ci.yml)

Flowable moddle extensions for CMMN 1.1. This package provides Flowable-specific extensions for [@jylups/cmmn-moddle](https://github.com/jylups/cmmn-moddle), enabling support for Flowable's custom CMMN elements and attributes in [@jylups/cmmn-js](https://github.com/jylups/cmmn-js) based applications.

## Installation

```bash
npm install flowable-cmmn-moddle
```

## Usage

### With cmmn-js

```javascript
import CmmnModeler from '@jylups/cmmn-js/lib/Modeler';
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
import CmmnModeler from '@jylups/cmmn-js/lib/Modeler';
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

### Tasks
On every task (`cmmn:task`, `cmmn:humanTask`, `cmmn:caseTask`, `cmmn:processTask` and `cmmn:decisionTask`):
- `flowable:async`, `flowable:exclusive` - Start the task asynchronously, as an exclusive job
- `flowable:asyncLeave`, `flowable:asyncLeaveExclusive` - Leave the task asynchronously, as an exclusive job
- `flowable:isBlockingExpression` - Expression for `isBlocking`
- `flowable:sameDeployment` - Use the form, case or process of the same deployment

On a `cmmn:task`, by its `flowable:type` (`java`, `script`, `http`, `external-worker`, `casePage`, `send-event`, `mail`):
- `flowable:class`, `flowable:expression`, `flowable:delegateExpression` - Implementation of a java or HTTP task
- `flowable:resultVariableName`, `flowable:storeResultVariableAsTransient` - Result of a java or script task
- `flowable:scriptFormat`, `flowable:autoStoreVariables`, `flowable:doNotIncludeVariables` - Script task
- `flowable:topic`, `flowable:doNotIncludeVariables` - External worker task
- `flowable:parallelInSameTransaction` - HTTP task
- `flowable:formKey`, `flowable:formFieldValidation` - Form of a java task or a case page
- `flowable:assignee`, `flowable:owner`, `flowable:candidateUsers`, `flowable:candidateGroups`, `flowable:label`, `flowable:icon` - Case page

Saving keeps these attributes as written: none of them has a default, since Flowable's default differs by task (for example `sameDeployment` is true for human tasks and false for case and process tasks).

### Human Tasks
- `flowable:assignee`, `flowable:owner` - Task assignee and owner
- `flowable:candidateUsers` - Candidate users
- `flowable:candidateGroups` - Candidate groups
- `flowable:dueDate` - Task due date
- `flowable:followUpDate` - Task follow-up date
- `flowable:priority` - Task priority
- `flowable:category` - Task category
- `flowable:taskIdVariableName`, `flowable:taskCompleterVariableName` - Variables for the task id and the user who completed it
- `flowable:formKey` - Associated form key
- `flowable:formFieldValidation` - Form field validation

### Process and Case Tasks
- `flowable:businessKey`, `flowable:inheritBusinessKey` - Business key of the child process or case
- `flowable:inheritVariables` - Pass all variables to the child process or case
- `flowable:idVariableName` - Variable for the id of the child process or case
- `flowable:fallbackToDefaultTenant` - Fallback to default tenant

### Process Tasks
- `flowable:processBinding` - Process binding type
- `flowable:processVersion` - Process version
- `flowable:processTenantId` - Process tenant ID

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

A listener has a `class`, `expression` or `delegateExpression`, or `type="script"` with a `<flowable:script>` child: `language`, an optional `resultVariable`, and the script as its text. Flowable runs the script only with `type="script"`; `scriptFormat` and `resource` of `<flowable:script>` are kept for models written in the Camunda form.

### Variable Mapping
- `flowable:in` - Input variable mapping
- `flowable:out` - Output variable mapping

Flowable reads `source` or `sourceExpression`, `target` or `targetExpression`, `sourceType` and `targetType` (the variable type, for example `string` or `integer`) and `transient`. `variables`, `local` and `businessKey` are kept for models written in the Camunda form, but Flowable does not read them; use `flowable:inheritVariables` and `flowable:businessKey` of the task instead.

### Repetition Rules
- `flowable:repeatOnStandardEvent` - Repeat on standard event
- `flowable:counterVariable` - Counter variable
- `flowable:maxInstanceCount` - Maximum instance count, a number or `unlimited`
- `flowable:collectionVariable` - Collection, or an expression giving one, to repeat the plan item for each element of
- `flowable:elementVariable`, `flowable:elementIndexVariable` - Local variables for the element and its index
- `flowable:ignoreCounterVariable` - `true` to not keep a counter variable

### Stages and Milestones
- `flowable:includeInStageOverview` - Whether the stage or milestone is shown in the stage overview (`true` by default, or an expression)
- `flowable:displayOrder` - Order in the stage overview, a number
- `flowable:businessStatus` - Business status set on the case when the stage starts or the milestone is reached
- `flowable:autoCompleteCondition` - Expression that completes a stage when it holds (stages only)
- `flowable:milestoneVariable` - Milestone variable (milestones only)

Flowable also reads an `autoComplete` attribute in the Flowable namespace. It is kept, as an unknown attribute with an import warning, because CMMN stages already have an `autoComplete` attribute; use the CMMN one.

### Sentries and Exit Criteria
- `flowable:triggerMode` - When the sentry checks its on parts: `default` or `onEvent`
- `flowable:exitEventType` - What an exit criterion does: `exit` (the default), `complete` or `forceComplete`
- `flowable:exitType` - Which instances of a repeating plan item an exit criterion exits: `default`, `activeInstances` or `activeAndEnabledInstances`

### Lifecycle Listeners
- `flowable:planItemLifecycleListener` - Plan item lifecycle listener (`sourceState`, `targetState`, `onTransaction`, and the listener attributes, fields and script)
- `flowable:caseLifecycleListener` - Case lifecycle listener

### Item Control Rules
- `flowable:completionNeutralRule` - Completion neutral rule, with a `<condition>` child in the CMMN namespace
- `flowable:parentCompletionRule` - Parent completion rule (`type`)
- `flowable:reactivationRule` - Reactivation rule (`activateCondition`, `ignoreCondition`, `defaultCondition`)
- `flowable:defaultReactivationRule` - Default reactivation rule of a reactivation event listener

### Event Listeners
On every event listener (`cmmn:eventListener`, `cmmn:userEventListener`, `cmmn:timerEventListener`):
- `flowable:availableCondition` - Expression that makes the event listener available

On a `cmmn:eventListener`:
- `flowable:eventType` - The kind of event listener: `signal`, `variable`, `intent` or `reactivate`; without it, an event listener waits for the event registry event of its `<flowable:eventType>` extension element
- `flowable:signalRef` - Signal of a signal event listener
- `flowable:variableName`, `flowable:variableChangeType` - Variable of a variable event listener, and the change it waits for (`all`, `create`, `update`, `update-create`, `delete`)

### Event Registry
- `flowable:eventType` - Event type of a case, an event listener or a send event task
- `flowable:startEventCorrelationConfiguration` - Correlation configuration of a case started by an event
- `flowable:eventCorrelationParameter` - Correlation parameter (`name`, `value`)
- `flowable:eventInParameter`, `flowable:eventOutParameter` - Event payload mapping (`source`, `sourceExpression`, `target`, `targetExpression`, `transient`, ...)
- `flowable:channelKey` - Channels a send event task sends on, comma separated or an expression
- `flowable:systemChannel` - Also send the event on the system channel

### External Worker and HTTP Tasks
- `flowable:externalWorkerInParameter`, `flowable:externalWorkerOutParameter` - External worker variable mapping
- `flowable:httpRequestHandler`, `flowable:httpResponseHandler` - HTTP task handlers (`class` or `delegateExpression`)

### Other Extension Elements
- `flowable:variableAggregation` - Variable aggregation of a repetition rule, with `<variable>` children in the CMMN namespace
- `flowable:condition` - Condition built in the Flowable modeler, with nested conditions
- `flowable:element-name` - Name of an element with line breaks

### Elements Without a Type
Other `flowable:*` extension elements, such as the Flowable modeler's `flowable:work-form-field-validation` or custom extension elements, are kept as generic elements with their attributes, text and children (with `@jylups/cmmn-moddle` 6.1.0 or later). `flowable:*` attributes without a property are kept as unknown attributes, with an import warning.

### Diagram Interchange
- `flowable:docker` - In the `di:extension` of a `cmmndi:CMMNEdge`: the point where the connection attaches to its source or target shape (`type` is `source` or `target`, `x` and `y` are relative to the shape's top left corner). The Flowable modeler writes them; cmmn-js keeps them as they were read and does not update them when shapes or connections change, and adds none to new connections.

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
- Node.js 24 or later (the tests `require()` the ES modules of `@jylups/cmmn-moddle`, `moddle` and `moddle-xml`, which needs Node 20.19 or later; CI runs on Node 24 and 26)
- npm

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

Each model is imported with @jylups/cmmn-moddle and this descriptor, exported again,
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

- [@jylups/cmmn-js](https://github.com/jylups/cmmn-js) - CMMN 1.1 modeling for the web, a maintained fork of [bpmn-io/cmmn-js](https://github.com/bpmn-io/cmmn-js)
- [@jylups/cmmn-moddle](https://github.com/jylups/cmmn-moddle) - CMMN 1.1 meta-model, a maintained fork of [bpmn-io/cmmn-moddle](https://github.com/bpmn-io/cmmn-moddle)
- [Flowable](https://github.com/flowable/flowable-engine) - Open source business process engine

## Acknowledgments

- Based on [camunda-cmmn-moddle](https://github.com/camunda/camunda-cmmn-moddle)
- Built on top of the excellent [bpmn.io](https://bpmn.io) toolkit
