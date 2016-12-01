import { expect } from 'chai';
import { Parser, RuleType } from '../src/parser';

describe('Parser', function() {
  const parser = new Parser();

  describe('Tag Rule', function() {
    const tagRule = `body {
      background-color: #FFFFFF;
      margin: 2px;
    }`;
    const ast = parser.parse(tagRule);

    describe('AST', function() {
      it('has type Stylesheet', function() {
        expect(ast.type).to.eq('Stylesheet');
      });

      it('has a list of rules', function() {
        expect(ast.rules.length).to.eq(1);
      });

      describe('Rule', function() {
        const rule = ast.rules[0];
        it('has type "Tag Rule"', function() {
          expect(rule.type).to.eq(RuleType.Tag);
        });

        it('has name "body"', function() {
          expect(rule.name).to.eq('body');
        });

        it('has declarations', function() {
          expect(rule.declarations.length).to.eq(2);
        });

        describe('background-color declaration', function() {
          const bgColorDeclaration = rule.declarations[0];
          it('has background-color property', function() {
            expect(bgColorDeclaration.property).to.eq('background-color');
          });

          it('has #FFFFFF color', function() {
            expect(bgColorDeclaration.value).to.eq('#FFFFFF');
          });
        });

        describe('margin declaration', function() {
          const marginDeclaration = rule.declarations[1];
          it('has margin property', function() {
            expect(marginDeclaration.property).to.eq('margin');
          });

          it('has 2px value', function() {
            expect(marginDeclaration.value).to.eq('2px');
          });
        });
      });
    });
  });

  describe('Class Rule', function() {
    const classRule = `.active {
      background-color: #CCCCCC;
      margin: 2px;
    }`;
    const ast = parser.parse(classRule);

    describe('AST', function() {
      it('has type Stylesheet', function() {
        expect(ast.type).to.eq('Stylesheet');
      });

      it('has a list of Rules', function() {
        expect(ast.rules.length).to.eq(1);
      });

      describe('Rule', function() {
        const rule = ast.rules[0];

        it('has type "Class Rule"', function() {
          expect(rule.type).to.eq(RuleType.Class);
        });

        it('has name "active"', function() {
          expect(rule.name).to.eq('active');
        });
      });
    });
  });
});