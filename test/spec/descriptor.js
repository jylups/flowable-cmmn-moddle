'use strict';


describe('descriptor', function() {

  var flowableDescriptor = require('../../resources/flowable');


  it('should provide model', function() {

    // then
    expect(flowableDescriptor).to.exist;

    expect(flowableDescriptor.uri).to.eql('http://flowable.org/schema/1.0/cmmn');
    expect(flowableDescriptor.prefix).to.eql('flowable');
  });

});