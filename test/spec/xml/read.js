/* global Promise */

'use strict';


var readFile = require('../../helper').readFile,
    createModdle = require('../../helper').createModdle;


describe('read', function() {

  describe('should read extensions', function() {

    var moddle;

    beforeEach(function() {
      moddle = createModdle();
    });


    describe('flowable:historyTimeToLive', function() {

      it('on Case', function() {

        // given
        var xml = readFile('test/fixtures/xml/case-flowable-historyTimeToLive.part.cmmn');

        // when
        return moddle.fromXML(xml, 'cmmn:Case').then(function(result) {
          var cmmnCase = result.rootElement;

          // then
          expect(cmmnCase).to.jsonEqual({
            $type: 'cmmn:Case',
            historyTimeToLive: 'foo'
          });
        });

      });
    });


    describe('flowable:priority', function() {

      it('on HumanTask', function() {

        // given
        var xml = readFile('test/fixtures/xml/humanTask-flowable-priority.part.cmmn');

        // when
        return moddle.fromXML(xml, 'cmmn:HumanTask').then(function(result) {
          var serviceTask = result.rootElement;

          // then
          expect(serviceTask).to.jsonEqual({
            $type: 'cmmn:HumanTask',
            priority: '${ priority }'
          });
        });

      });
    });


    it('flowable:script', function() {

      // given
      var xml = readFile('test/fixtures/xml/flowable-script.part.cmmn');

      // when
      return moddle.fromXML(xml, 'flowable:Script').then(function(result) {
        var script = result.rootElement;

        // then
        expect(script).to.jsonEqual({
          $type: 'flowable:Script',
          scriptFormat: 'groovy',
          resource: 'null',
          value: '\n  foo = bar;\n'
        });
      });
    });


    it('flowable:in', function() {

      // given
      var xml = readFile('test/fixtures/xml/flowable-in.part.cmmn');

      // when
      return moddle.fromXML(xml, 'flowable:In').then(function(result) {
        var binding = result.rootElement;

        // then
        expect(binding).to.jsonEqual({
          $type: 'flowable:In',
          sourceExpression: 'fooExp',
          source: 'foo',
          target: 'bar',
          variables: 'all',
          local: true
        });
      });
    });


    it('flowable:out', function() {

      // given
      var xml = readFile('test/fixtures/xml/flowable-out.part.cmmn');

      // when
      return moddle.fromXML(xml, 'flowable:Out').then(function(result) {
        var binding = result.rootElement;

        // then
        expect(binding).to.jsonEqual({
          $type: 'flowable:Out',
          sourceExpression: 'fooExp',
          source: 'foo',
          target: 'bar',
          variables: 'all',
          local: true
        });
      });
    });


    describe('flowable:FormSupported with flowable:formKey', function() {

      it('on HumanTask', function() {

        // given
        var xml = readFile('test/fixtures/xml/humanTask-flowable-formSupported.part.cmmn');

        // when
        return moddle.fromXML(xml, 'cmmn:HumanTask').then(function(result) {
          var task = result.rootElement;

          // then
          expect(task).to.jsonEqual({
            $type: 'cmmn:HumanTask',
            formKey: 'form.html'
          });
        });
      });

    });


    it('cmmn:CaseTask', function() {

      // given
      var xml = readFile('test/fixtures/xml/caseTask.part.cmmn');

      // when
      return moddle.fromXML(xml, 'cmmn:CaseTask').then(function(result) {
        var callActivity = result.rootElement;

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:CaseTask',
          caseBinding: 'foo',
          caseVersion: '1',
          caseTenantId: 'bar'
        });
      });

    });


    it('cmmn:DecisionTask', function() {

      // given
      var xml = readFile('test/fixtures/xml/decisionTask.part.cmmn');

      // when
      return moddle.fromXML(xml, 'cmmn:DecisionTask').then(function(result) {
        var callActivity = result.rootElement;

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:DecisionTask',
          decisionBinding: 'foo',
          decisionVersion: '1',
          decisionTenantId: 'bar',
          mapDecisionResult: 'resultList',
          resultVariable: 'aVariable'
        });
      });

    });


    it('cmmn:ProcessTask', function() {

      // given
      var xml = readFile('test/fixtures/xml/processTask.part.cmmn');

      // when
      return moddle.fromXML(xml, 'cmmn:ProcessTask').then(function(result) {
        var callActivity = result.rootElement;

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:ProcessTask',
          processBinding: 'foo',
          processVersion: '1',
          processTenantId: 'bar'
        });
      });

    });


    describe('task attributes', function() {

      function read(name, typeName) {
        return moddle.fromXML(readFile('test/fixtures/xml/' + name + '.part.cmmn'), typeName);
      }


      it('java task with class, async and form', function() {

        // when
        return read('task-flowable-java', 'cmmn:Task').then(function(result) {

          // then
          expect(result.warnings).to.be.empty;

          expect(result.rootElement).to.jsonEqual({
            $type: 'cmmn:Task',
            id: 'Task_Java',
            async: true,
            exclusive: false,
            asyncLeave: true,
            asyncLeaveExclusive: true,
            isBlockingExpression: '${blocking}',
            type: 'java',
            'class': 'org.example.Delegate',
            resultVariableName: 'result',
            storeResultVariableAsTransient: true,
            formKey: 'javaForm',
            formFieldValidation: 'false'
          });
        });
      });


      it('java task with expression or delegate expression', function() {

        // when
        return Promise.all([
          read('task-flowable-expression', 'cmmn:Task'),
          read('task-flowable-delegateExpression', 'cmmn:Task')
        ]).then(function(results) {

          // then
          expect(results[0].rootElement.get('flowable:expression')).to.eql('${bean.run(planItemInstance)}');
          expect(results[1].rootElement.get('flowable:delegateExpression')).to.eql('${delegate}');
        });
      });


      it('script task', function() {

        // when
        return read('task-flowable-script', 'cmmn:Task').then(function(result) {

          // then
          expect(result.warnings).to.be.empty;

          expect(result.rootElement).to.jsonEqual({
            $type: 'cmmn:Task',
            id: 'Task_Script',
            type: 'script',
            resultVariableName: 'scriptResult',
            scriptFormat: 'groovy',
            autoStoreVariables: false,
            doNotIncludeVariables: true
          });
        });
      });


      it('external worker and HTTP tasks', function() {

        // when
        return Promise.all([
          read('task-flowable-external-worker', 'cmmn:Task'),
          read('task-flowable-http', 'cmmn:Task')
        ]).then(function(results) {

          // then
          expect(results[0].warnings).to.be.empty;
          expect(results[0].rootElement).to.jsonEqual({
            $type: 'cmmn:Task',
            id: 'Task_Worker',
            type: 'external-worker',
            doNotIncludeVariables: true,
            topic: 'orderService'
          });

          expect(results[1].warnings).to.be.empty;
          expect(results[1].rootElement).to.jsonEqual({
            $type: 'cmmn:Task',
            id: 'Task_Http',
            type: 'http',
            'class': 'org.example.HttpBehavior',
            parallelInSameTransaction: true
          });
        });
      });


      it('case page task', function() {

        // when
        return read('task-flowable-casePage', 'cmmn:Task').then(function(result) {

          // then
          expect(result.warnings).to.be.empty;

          expect(result.rootElement).to.jsonEqual({
            $type: 'cmmn:Task',
            id: 'Task_Page',
            sameDeployment: false,
            type: 'casePage',
            formKey: 'pageKey',
            assignee: '${initiator}',
            owner: 'janedoe',
            candidateUsers: 'johndoe,janedoe',
            candidateGroups: 'sales,management',
            label: 'Overview',
            icon: 'dashboard'
          });
        });
      });


      it('human task with the attributes of all tasks', function() {

        // when
        return read('humanTask-flowable-task-attributes', 'cmmn:HumanTask').then(function(result) {
          var task = result.rootElement;

          // then
          expect(result.warnings).to.be.empty;

          expect(task).to.jsonEqual({
            $type: 'cmmn:HumanTask',
            id: 'HumanTask_1',
            async: true,
            exclusive: true,
            sameDeployment: false,
            formKey: 'taskForm',
            assignee: 'kermit',
            priority: '50'
          });

          expect(task.$instanceOf('flowable:Assignable')).to.be.true;
          expect(task.$instanceOf('flowable:FormSupported')).to.be.true;
        });
      });


      it('process and case tasks with the attributes of child tasks', function() {

        // when
        return Promise.all([
          read('processTask-flowable-child', 'cmmn:ProcessTask'),
          read('caseTask-flowable-child', 'cmmn:CaseTask')
        ]).then(function(results) {

          // then
          expect(results[0].warnings).to.be.empty;
          expect(results[0].rootElement).to.jsonEqual({
            $type: 'cmmn:ProcessTask',
            id: 'ProcessTask_1',
            sameDeployment: true,
            businessKey: '${businessKey}',
            inheritBusinessKey: true,
            inheritVariables: true,
            idVariableName: 'processIdVariable',
            fallbackToDefaultTenant: true,
            processBinding: 'deployment'
          });

          expect(results[1].warnings).to.be.empty;
          expect(results[1].rootElement).to.jsonEqual({
            $type: 'cmmn:CaseTask',
            id: 'CaseTask_1',
            sameDeployment: false,
            businessKey: 'childKey',
            inheritBusinessKey: false,
            inheritVariables: true,
            idVariableName: 'caseIdVariable',
            fallbackToDefaultTenant: false
          });
        });
      });


      it('no assignment or form markers on other tasks', function() {

        // when
        return read('task-flowable-casePage', 'cmmn:Task').then(function(result) {
          var task = result.rootElement;

          // then
          expect(task.$instanceOf('flowable:Task')).to.be.true;
          expect(task.$instanceOf('flowable:Assignable')).to.be.false;
          expect(task.$instanceOf('flowable:FormSupported')).to.be.false;
        });
      });

    });


    describe('flowable:caseExecutionListener', function() {

      it('attributes', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-caseExecutionListener.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:CaseExecutionListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:CaseExecutionListener',
            event: 'complete',
            'class': 'my.company.Listener',
            delegateExpression: '${myExecutionListener}',
            expression: '${myExecutionListener.notify(execution)}'
          });
        });

      });


      it('script', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-caseExecutionListener-script.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:CaseExecutionListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:CaseExecutionListener',
            event: 'complete',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: '\n    foo = bar;\n  '
            }
          });
        });
      });


      it('fields', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-caseExecutionListener-fields.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:CaseExecutionListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:CaseExecutionListener',
            event: 'start',
            'class': 'my.company.Listener',
            fields : [
              {
                $type: 'flowable:Field',
                name: 'fieldOne',
                stringValue: 'myString'
              },
              {
                $type: 'flowable:Field',
                name: 'fieldTwo',
                expression: '${myExpression}'
              }
            ]
          });
        });

      });


    });


    describe('flowable:taskListener', function() {

      it('attributes', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-taskListener.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:TaskListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:TaskListener',
            event: 'create',
            'class': 'my.company.Listener',
            delegateExpression: '${myTaskListener}',
            expression: '${myTaskListener.notify(task, task.eventName)}'
          });
        });

      });


      it('script', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-taskListener-script.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:TaskListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:TaskListener',
            event: 'create',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: '\n    foo = bar;\n  '
            }
          });
        });
      });

    });


    describe('flowable:variableListener', function() {

      it('attributes', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-variableListener.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:VariableListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:VariableListener',
            event: 'update',
            'class': 'my.company.Listener',
            delegateExpression: '${myListener}',
            expression: '${myListener.notify(execution)}'
          });
        });

      });


      it('script', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-variableListener-script.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:VariableListener').then(function(result) {
          var executionListener = result.rootElement;

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:VariableListener',
            event: 'update',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: '\n    foo = bar;\n  '
            }
          });
        });
      });

    });

    it('flowable:docker', function() {

      // given
      var xml = readFile('test/fixtures/xml/di-extension-flowable-docker.part.cmmn');

      // when
      return moddle.fromXML(xml, 'di:Extension').then(function(result) {
        var extension = result.rootElement;

        // then
        expect(result.warnings).to.be.empty;

        expect(extension).to.jsonEqual({
          $type: 'di:Extension',
          values: [
            { $type: 'flowable:Docker', type: 'source', x: 50, y: 40 },
            { $type: 'flowable:Docker', type: 'target', x: 9.5, y: 14 }
          ]
        });
      });
    });


    describe('flowable extension elements', function() {

      var NS = 'xmlns="http://www.omg.org/spec/CMMN/20151109/MODEL" ' +
               'xmlns:flowable="http://flowable.org/cmmn"';

      function readExtensions(xml) {
        return moddle.fromXML(
          '<extensionElements ' + NS + '>' + xml + '</extensionElements>',
          'cmmn:ExtensionElements'
        ).then(function(result) {
          expect(result.warnings).to.be.empty;

          return result.rootElement.values;
        });
      }


      it('lifecycle listeners', function() {

        return readExtensions(
          '<flowable:planItemLifecycleListener class="org.example.Listener" sourceState="available" targetState="active">' +
            '<flowable:field name="greeting" stringValue="hello" />' +
          '</flowable:planItemLifecycleListener>' +
          '<flowable:caseLifecycleListener expression="${done}" targetState="completed" />'
        ).then(function(values) {

          // then
          expect(values).to.jsonEqual([
            {
              $type: 'flowable:PlanItemLifecycleListener',
              'class': 'org.example.Listener',
              sourceState: 'available',
              targetState: 'active',
              fields: [
                { $type: 'flowable:Field', name: 'greeting', stringValue: 'hello' }
              ]
            },
            {
              $type: 'flowable:CaseLifecycleListener',
              expression: '${done}',
              targetState: 'completed'
            }
          ]);
        });
      });


      it('completionNeutralRule with a condition in the CMMN namespace', function() {

        return readExtensions(
          '<flowable:completionNeutralRule name="Neutral">' +
            '<condition>${neutral}</condition>' +
          '</flowable:completionNeutralRule>'
        ).then(function(values) {

          // then
          expect(values).to.jsonEqual([
            {
              $type: 'flowable:CompletionNeutralRule',
              name: 'Neutral',
              condition: { $type: 'cmmn:Expression', body: '${neutral}' }
            }
          ]);
        });
      });


      it('variableAggregation with variables in the CMMN namespace', function() {

        return readExtensions(
          '<flowable:variableAggregation target="reviews">' +
            '<variable source="approved" />' +
            '<variable sourceExpression="${comment}" target="description" />' +
          '</flowable:variableAggregation>'
        ).then(function(values) {

          // then
          expect(values).to.jsonEqual([
            {
              $type: 'flowable:VariableAggregation',
              target: 'reviews',
              variable: [
                { $type: 'flowable:AggregationVariable', source: 'approved' },
                { $type: 'flowable:AggregationVariable', sourceExpression: '${comment}', target: 'description' }
              ]
            }
          ]);
        });
      });


      it('event registry elements', function() {

        return readExtensions(
          '<flowable:eventType>myEvent</flowable:eventType>' +
          '<flowable:startEventCorrelationConfiguration>storeAsUniqueReferenceId</flowable:startEventCorrelationConfiguration>' +
          '<flowable:eventCorrelationParameter name="customerId" value="${customerId}" />' +
          '<flowable:eventOutParameter source="payload" target="result" transient="true" />'
        ).then(function(values) {

          // then
          expect(values).to.jsonEqual([
            { $type: 'flowable:EventType', body: 'myEvent' },
            { $type: 'flowable:StartEventCorrelationConfiguration', body: 'storeAsUniqueReferenceId' },
            { $type: 'flowable:EventCorrelationParameter', name: 'customerId', value: '${customerId}' },
            { $type: 'flowable:EventOutParameter', source: 'payload', target: 'result', 'transient': 'true' }
          ]);
        });
      });


      it('nested conditions and element-name', function() {

        return readExtensions(
          '<flowable:condition group="true" match="all">' +
            '<flowable:condition sourceName="decided" operator="vars:exists" />' +
          '</flowable:condition>' +
          '<flowable:element-name>Review the claim</flowable:element-name>'
        ).then(function(values) {

          // then
          expect(values).to.jsonEqual([
            {
              $type: 'flowable:Condition',
              group: 'true',
              match: 'all',
              conditions: [
                { $type: 'flowable:Condition', sourceName: 'decided', operator: 'vars:exists' }
              ]
            },
            { $type: 'flowable:Element-name', body: 'Review the claim' }
          ]);
        });
      });

    });


    describe('flowable:field', function() {

      it('attributes', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-attributes.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:Field').then(function(result) {
          var field = result.rootElement;

          // then
          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            expression: '<html><body>Hi!</body></html>',
            stringValue: '41 is not the answer!'
          });
        });
      });


      it('with nested expression and string', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-children.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:Field').then(function(result) {
          var field = result.rootElement;

          // then
          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            expressionElement: {
              $type: 'flowable:Expression',
              body: '<html><body>Hi!</body></html>'
            },
            string: '42 is the answer!'
          });
        });
      });


      it('with nested expression and string in the CMMN namespace', function() {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-cmmn-children.part.cmmn');

        // when
        return moddle.fromXML(xml, 'flowable:Field').then(function(result) {
          var field = result.rootElement;

          // then
          expect(result.warnings).to.be.empty;

          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            cmmnExpression: {
              $type: 'cmmn:Expression',
              body: '${greeting + name}'
            },
            cmmnString: {
              $type: 'cmmn:String',
              body: '42 is the answer!'
            }
          });
        });
      });

    });


    it('flowable:repeatOnStandardEvent', function() {

      // given
      var xml = readFile('test/fixtures/xml/repetitionRule-repeatOnStandardEvent.part.cmmn');

      // when
      return moddle.fromXML(xml, 'cmmn:RepetitionRule').then(function(result) {
        var callActivity = result.rootElement;

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:RepetitionRule',
          repeatOnStandardEvent: 'exit'
        });
      });

    });


    it('flowable:variableOnPart', function() {

      // given
      var xml = readFile('test/fixtures/xml/flowable-variable-on-part.part.cmmn');

      // when
      return moddle.fromXML(xml, 'flowable:VariableOnPart').then(function(result) {
        var onPart = result.rootElement;

        // then
        expect(onPart).to.jsonEqual({
          $type: 'flowable:VariableOnPart',
          variableName: 'foo',
          variableEvent: 'create'
        });
      });

    });

  });

});
