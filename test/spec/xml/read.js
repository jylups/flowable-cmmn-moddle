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

      it('on Case', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/case-flowable-historyTimeToLive.part.cmmn');

        // when
        moddle.fromXML(xml, 'cmmn:Case', function(err, cmmnCase) {

          // then
          expect(cmmnCase).to.jsonEqual({
            $type: 'cmmn:Case',
            historyTimeToLive: 'foo'
          });

          done(err);
        });

      });
    });


    describe('flowable:priority', function() {

      it('on HumanTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/humanTask-flowable-priority.part.cmmn');

        // when
        moddle.fromXML(xml, 'cmmn:HumanTask', function(err, serviceTask) {

          // then
          expect(serviceTask).to.jsonEqual({
            $type: 'cmmn:HumanTask',
            priority: '${ priority }'
          });

          done(err);
        });

      });
    });


    it('flowable:script', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-script.part.cmmn');

      // when
      moddle.fromXML(xml, 'flowable:Script', function(err, script) {

        // then
        expect(script).to.jsonEqual({
          $type: 'flowable:Script',
          scriptFormat: 'groovy',
          resource: 'null',
          value: 'foo = bar;'
        });

        done(err);
      });
    });


    it('flowable:in', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-in.part.cmmn');

      // when
      moddle.fromXML(xml, 'flowable:In', function(err, binding) {

        // then
        expect(binding).to.jsonEqual({
          $type: 'flowable:In',
          sourceExpression: 'fooExp',
          source: 'foo',
          target: 'bar',
          variables: 'all',
          local: true
        });

        done(err);
      });
    });


    it('flowable:out', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-out.part.cmmn');

      // when
      moddle.fromXML(xml, 'flowable:Out', function(err, binding) {

        // then
        expect(binding).to.jsonEqual({
          $type: 'flowable:Out',
          sourceExpression: 'fooExp',
          source: 'foo',
          target: 'bar',
          variables: 'all',
          local: true
        });

        done(err);
      });
    });


    describe('flowable:FormSupported with flowable:formKey', function() {

      it('on HumanTask', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/humanTask-flowable-formSupported.part.cmmn');

        // when
        moddle.fromXML(xml, 'cmmn:HumanTask', function(err, task) {

          // then
          expect(task).to.jsonEqual({
            $type: 'cmmn:HumanTask',
            formKey: 'form.html'
          });

          done(err);
        });
      });

    });


    it('cmmn:CaseTask', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/caseTask.part.cmmn');

      // when
      moddle.fromXML(xml, 'cmmn:CaseTask', function(err, callActivity) {

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:CaseTask',
          caseBinding: 'foo',
          caseVersion: '1',
          caseTenantId: 'bar'
        });

        done(err);
      });

    });


    it('cmmn:DecisionTask', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/decisionTask.part.cmmn');

      // when
      moddle.fromXML(xml, 'cmmn:DecisionTask', function(err, callActivity) {

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:DecisionTask',
          decisionBinding: 'foo',
          decisionVersion: '1',
          decisionTenantId: 'bar',
          mapDecisionResult: 'resultList',
          resultVariable: 'aVariable'
        });

        done(err);
      });

    });


    it('cmmn:ProcessTask', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/processTask.part.cmmn');

      // when
      moddle.fromXML(xml, 'cmmn:ProcessTask', function(err, callActivity) {

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:ProcessTask',
          processBinding: 'foo',
          processVersion: '1',
          processTenantId: 'bar'
        });

        done(err);
      });

    });


    describe('flowable:caseExecutionListener', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-caseExecutionListener.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:CaseExecutionListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:CaseExecutionListener',
            event: 'complete',
            'class': 'my.company.Listener',
            delegateExpression: '${myExecutionListener}',
            expression: '${myExecutionListener.notify(execution)}'
          });

          done(err);
        });

      });


      it('script', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-caseExecutionListener-script.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:CaseExecutionListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:CaseExecutionListener',
            event: 'complete',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: 'foo = bar;'
            }
          });

          done(err);
        });
      });


      it('fields', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-caseExecutionListener-fields.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:CaseExecutionListener', function(err, executionListener) {

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

          done(err);
        });

      });


    });


    describe('flowable:taskListener', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-taskListener.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:TaskListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:TaskListener',
            event: 'create',
            'class': 'my.company.Listener',
            delegateExpression: '${myTaskListener}',
            expression: '${myTaskListener.notify(task, task.eventName)}'
          });

          done(err);
        });

      });


      it('script', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-taskListener-script.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:TaskListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:TaskListener',
            event: 'create',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: 'foo = bar;'
            }
          });

          done(err);
        });
      });

    });


    describe('flowable:variableListener', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-variableListener.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:VariableListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:VariableListener',
            event: 'update',
            'class': 'my.company.Listener',
            delegateExpression: '${myListener}',
            expression: '${myListener.notify(execution)}'
          });

          done(err);
        });

      });


      it('script', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-variableListener-script.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:VariableListener', function(err, executionListener) {

          // then
          expect(executionListener).to.jsonEqual({
            $type: 'flowable:VariableListener',
            event: 'update',
            script: {
              $type: 'flowable:Script',
              scriptFormat: 'groovy',
              value: 'foo = bar;'
            }
          });

          done(err);
        });
      });

    });

    describe('flowable:field', function() {

      it('attributes', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-attributes.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:Field', function(err, field) {

          // then
          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            expression: '<html><body>Hi!</body></html>',
            stringValue: '41 is not the answer!'
          });

          done(err);
        });
      });


      it('with nested expression and string', function(done) {

        // given
        var xml = readFile('test/fixtures/xml/flowable-field-children.part.cmmn');

        // when
        moddle.fromXML(xml, 'flowable:Field', function(err, field) {

          // then
          expect(field).to.jsonEqual({
            $type: 'flowable:Field',
            name: 'html',
            expression: '<html><body>Hi!</body></html>',
            string: '42 is the answer!'
          });

          done(err);
        });
      });

    });


    it('flowable:repeatOnStandardEvent', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/repetitionRule-repeatOnStandardEvent.part.cmmn');

      // when
      moddle.fromXML(xml, 'cmmn:RepetitionRule', function(err, callActivity) {

        // then
        expect(callActivity).to.jsonEqual({
          $type: 'cmmn:RepetitionRule',
          repeatOnStandardEvent: 'exit'
        });

        done(err);
      });

    });


    it('flowable:variableOnPart', function(done) {

      // given
      var xml = readFile('test/fixtures/xml/flowable-variable-on-part.part.cmmn');

      // when
      moddle.fromXML(xml, 'flowable:VariableOnPart', function(err, onPart) {

        // then
        expect(onPart).to.jsonEqual({
          $type: 'flowable:VariableOnPart',
          variableName: 'foo',
          variableEvent: 'create'
        });

        done(err);
      });

    });

  });

});
