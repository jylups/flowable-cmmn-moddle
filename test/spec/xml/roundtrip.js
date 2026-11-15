'use strict';

var readFile = require('../../helper').readFile,
    createModdle = require('../../helper').createModdle;



describe('import -> export roundtrip', function() {

  function stripSpaces(xml) {
    return (
      xml
        .replace(/\n|\r/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s\/>/g, '/>')
        .replace(/>\s+</g, '><')
    );
  }

  function validateExport(file, typeName) {

    return function() {

      var xml = stripSpaces(readFile(file));

      var moddle = createModdle();

      return moddle.fromXML(xml, typeName || 'cmmn:Definitions').then(function(result) {

        // fragments (*.part.cmmn) have no XML declaration
        return moddle.toXML(result.rootElement, { preamble: !typeName });
      }).then(function(result) {
        var savedXML = stripSpaces(result.xml);

        expect(savedXML).to.eql(xml);
      });
    };
  }


  describe('should keep flowable attributes', function() {

    it('flowable:FormData', validateExport('test/fixtures/xml/humanTask-flowable-formKey.cmmn'));

    it('flowable:InputOutput', validateExport('test/fixtures/xml/listener-flowable-nestedScript.cmmn'));

    it('flowable:VariableOnPart', validateExport('test/fixtures/xml/sentry-flowable-variable-on-part.cmmn'));

  });


  describe('should keep flowable extension elements', function() {

    function validateExtensions(name) {
      return validateExport('test/fixtures/xml/' + name + '.part.cmmn', 'cmmn:ExtensionElements');
    }

    it('lifecycle listeners', validateExtensions('flowable-lifecycle-listeners'));

    it('item control rules', validateExtensions('flowable-item-control-rules'));

    it('event registry', validateExtensions('flowable-event-registry'));

    it('external worker parameters, HTTP handlers and element name',
      validateExtensions('flowable-external-worker-and-http'));

    it('variable aggregation', validateExtensions('flowable-variable-aggregation'));

    it('condition', validateExtensions('flowable-condition'));

    it('elements without a type, as generic elements', validateExtensions('flowable-unknown-elements'));

  });


  describe('should keep flowable DI extensions', function() {

    it('flowable:docker', validateExport(
      'test/fixtures/xml/di-extension-flowable-docker.part.cmmn', 'di:Extension'));

  });


  describe('should keep the form of flowable:field values', function() {

    it('expression and string children', validateExport(
      'test/fixtures/xml/flowable-field-expression-element.part.cmmn', 'flowable:Field'));

    it('expression and stringValue attributes', validateExport(
      'test/fixtures/xml/flowable-field-expression-attribute.part.cmmn', 'flowable:Field'));

    it('expression and string children in the CMMN namespace', validateExport(
      'test/fixtures/xml/flowable-field-cmmn-children.part.cmmn', 'flowable:Field'));

  });

});
