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
