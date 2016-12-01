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
    else if(value.startsWith('.')) {
      return RuleType.Class;
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
  static fail(invalidToken: Token, expectedTokenTypes: Array<TokenType> | null) {
    const tokenName = TokenType[invalidToken.type];
    if(expectedTokenTypes) {
      throw `Expected ${expectedTokenTypes.map(t => TokenType[t]).join(',')} got ${tokenName}`;
    } else {
      throw `Encountered unexpected token ${tokenName} ${invalidToken.value}`;
    }
  }
  static cleanName(name: string) : string {
    return name.replace('.', '');
  }
  parse(program: string) : AST {
    const lexer = new Lexer(program);

    const selector = lexer.nextToken();
    if(selector.type !== TokenType.IDENTIFIER && selector.type !== TokenType.CLASSNAME) {
      Parser.fail(selector, [TokenType.IDENTIFIER, TokenType.CLASSNAME]);
    }

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
          Parser.fail(potentialValue, null);
        }
      }
    }

    let ruleNode = {
      type: Parser.getRuleType(selector.value),
      name: Parser.cleanName(selector.value),
      declarations: declarations
    };

    return new AST('Stylesheet', [ruleNode]);
  }
}

export enum RuleType {
  Tag,
  Class,
  Undefined
};