'use strict';

var CmmnModdle = require('cmmn-moddle').default;

var flowableDescriptor = require('../../resources/flowable');


describe('exports', function() {

  it('should extend cmmn-moddle', function() {

    // given
    var moddle = new CmmnModdle({
      flowable: flowableDescriptor
    });

    // when
    var humanTask = moddle.create('cmmn:HumanTask');

    // then
    expect(humanTask.$instanceOf('flowable:Assignable')).to.be.true;
  });

});