import { expect } from 'chai';
import { Parser } from '../src/parser';

describe("Parser", function() {
  const parser = new Parser();
  
  describe('Tag Rule', function() {
    const tagRule = `body {
      background-color: #FFFFFF;
    }`;
    const ast = parser.parse(tagRule);

    describe('AST', function() {
      it('has type Stylesheet', function() {
        expect(ast.type).to.eq('Stylesheet');
      });
    });
  });
});