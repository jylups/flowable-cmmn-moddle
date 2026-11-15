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
