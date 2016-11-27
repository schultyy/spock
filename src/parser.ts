import { Lexer, Token, TokenType } from './lexer';

class AST {
  type: string;
  rules: Array<Rule>;

  constructor(nodeType: string, rules: Array<Rule>) {
    this.type = nodeType;
    this.rules = rules;
  }
}

interface Rule {
  type: RuleType;
  name: string;
  declarations: Array<Declaration>;
}

interface Declaration {
  property: string;
  value: string;
}

export class Parser {
  static getRuleType(value: string) : RuleType {
    if(value === 'body') {
      return RuleType.Tag;
    }
    return RuleType.Undefined;
  }
  static assert(actualToken: Token, expectedTokenType: TokenType) {
    if(actualToken.type === expectedTokenType) {
      return;
    }

    const expectedTokenName = TokenType[expectedTokenType];
    const actualTokenName = TokenType[actualToken.type];

    throw `Expected ${expectedTokenName}, got ${actualTokenName} ${actualToken.value}`;
  }
  static fail(invalidToken: Token) {
    const tokenName = TokenType[invalidToken.type];

    throw `Encountered unexpected token ${tokenName} ${invalidToken.value}`;
  }
  parse(program: string) : AST {
    const lexer = new Lexer(program);

    const selector = lexer.nextToken();
    Parser.assert(selector, TokenType.IDENTIFIER);
    Parser.assert(lexer.nextToken(), TokenType.LBRACKET);

    //declarations

    let potentialSelector;
    let declarations : Array<Declaration> = [];

    while((potentialSelector = lexer.nextToken()).type !== TokenType.RBRACKET) {
      Parser.assert(lexer.nextToken(), TokenType.COLON);
      let potentialValue = lexer.nextToken();
      if(potentialSelector.type === TokenType.IDENTIFIER) {
        Parser.assert(lexer.nextToken(), TokenType.SEMICOLON);
        if(potentialValue.type === TokenType.COLOR || potentialValue.type === TokenType.NUMBER) {
          //found selector
          var declaration :Declaration =  {
            property: potentialSelector.value,
            value: potentialValue.value
          };
          declarations.push(declaration);
        }
        else {
          //Bail out, we didn't expect this to happen
          Parser.fail(potentialValue);
        }
      }
    }

    let ruleNode = {
      type: Parser.getRuleType(selector.value),
      name: selector.value,
      declarations: declarations
    };

    return new AST('Stylesheet', [ruleNode]);
  }
}

export enum RuleType {
  Tag,
  Undefined
};