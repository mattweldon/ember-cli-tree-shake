var DeadComputedProperties = require('../lib/dead-computed-properties');
var chai = require('chai'), expect = chai.expect
var cst = require('cst');
var fs = require('fs');

describe('Computed Properties', function() {
  before('setUp Parser', function() {
    this.treePaths = {
      'app': 'tests/dummy/app'
    };
    this.parser = new cst.Parser();
  })

  describe('Controllers', function() {
    before('setUp Collector', function() {
      const filepath = 'tests/dummy/app/controllers/foo.js';
      const code = fs.readFileSync(filepath, 'utf8');
      const tree = this.parser.parse(code);

      this.possiblyDead = new DeadComputedProperties(
        tree,
        this.treePaths,
        filepath
      ).collect();
    });

    describe('unused and possibly dead computed properties', function() {
      const unusedProperties = [
        'unused',
        'unused_bare',
        'unused_dependant',
        'unused_alias'
      ];

      unusedProperties.forEach(function(test) {
        it(test, function() {
          expect(this.possiblyDead).to.contain({
            'name': test,
            'path': 'tests/dummy/app/controllers/foo.js'
          });
        });
      });
    });

    describe('used computed properties', function() {
      const usedProperties = [
        'dependant',
        'used_in_template',
        'used_in_template_condition',
        'used_in_template_condition_body',
        'used_in_partial',
        'used_in_component_argument'
      ];

      usedProperties.forEach(function(test) {
        it(test, function() {
          expect(this.possiblyDead).to.not.contain({
            'name': test,
            'path': 'tests/dummy/app/controllers/foo.js'
          });
        });
      });
    });

    it('plain function not detected', function() {
      expect(this.possiblyDead).to.not.contain({
        'name': 'plain_function',
        'path': 'tests/dummy/app/controllers/foo.js'
      });
    });
  });

  describe('Components', function() {
    before('setUp Collector', function() {
      const filepath = 'tests/dummy/app/components/foo-component.js';
      const code = fs.readFileSync(filepath, 'utf8');
      const tree = this.parser.parse(code);

      this.possiblyDead = new DeadComputedProperties(
        tree,
        this.treePaths,
        filepath
      ).collect();
    })

    describe('unused and possibly dead computed properties', function() {
      const unusedProperties = [
        'unused'
      ];

      unusedProperties.forEach(function(test) {
        it(test, function() {
          expect(this.possiblyDead).to.contain({
            'name': test,
            'path': 'tests/dummy/app/components/foo-component.js'
          });
        });
      });
    });

    describe('used computed properties', function() {
      const usedProperties = [
        'used_in_template'
      ];

      usedProperties.forEach(function(test) {
        it(test, function() {
          expect(this.possiblyDead).to.not.contain({
            'name': test,
            'path': 'tests/dummy/app/components/foo-component.js'
          });
        });
      });
    });
  });
});