
export enum TokenType {
  LBRACKET,
  RBRACKET,
  IDENTIFIER,
  CLASSNAME,
  COLON,
  SEMICOLON,
  COLOR,
  NUMBER,
  EOF
}

export class Lexer {
  stylesheet: string;
  currentStreamPosition: number;

  constructor(stylesheet: string) {
    this.stylesheet = stylesheet;
    this.currentStreamPosition = 0;
  }

  static isChar(ch: string) : boolean {
    return !!ch.match(/[a-z]/i) || ch === '-';
  }

  static isWhitespace(ch: string) : boolean {
    return !!ch.match(/\w/);
  }

  static isNumber(ch: string) : boolean {
    return !!ch.match(/\d/);
  }

  nextToken() : Token {
    let stringBuffer = '';

    while(this.currentStreamPosition < this.stylesheet.length) {
      const currentChar = this.stylesheet[this.currentStreamPosition];
      this.currentStreamPosition++;
      const currentCharLookahead = this.stylesheet[this.currentStreamPosition];
      switch(currentChar) {
        case '{':
         return new Token(TokenType.LBRACKET, '{');
        case '}':
          return new Token(TokenType.RBRACKET, '}');
        case ':':
          return new Token(TokenType.COLON, ':');
        case ';':
          return new Token(TokenType.SEMICOLON, ';');
        default:
          if(Lexer.isChar(currentChar)) {
            stringBuffer += currentChar;
            if(!Lexer.isChar(currentCharLookahead)) {
              const newToken = new Token(TokenType.IDENTIFIER, stringBuffer);
              stringBuffer = '';
              return newToken;
            }
          }
          else if(currentChar === '.') {
            return this.consumeClassName();
          }
          else if (currentChar === '#') {
            return this.consumeColor();
          }
          else if (Lexer.isNumber(currentChar)) {
            return this.consumeNumber(currentChar);
          }
          else if (Lexer.isWhitespace(currentChar)) {
            continue;
          }
      }
    }
    return new Token(TokenType.EOF, "<<EOF>>");
  }

  private consumeClassName() : Token {
    let stringBuffer = '.';
    while(this.stylesheet[this.currentStreamPosition] !== ' ') {
      stringBuffer += this.stylesheet[this.currentStreamPosition];
      this.currentStreamPosition++;
    }
    return new Token(TokenType.CLASSNAME, stringBuffer);
  }

  private consumeNumber(currentChar: string) : Token {
    //TODO: Validate number and measurement like (px, em, etc.)
    //We pass in the currentChar right now, it's a not so nice solution, but should work for now
    let stringBuffer = currentChar;
    while(this.stylesheet[this.currentStreamPosition] !== ';') {
      stringBuffer += this.stylesheet[this.currentStreamPosition];
      this.currentStreamPosition++;
    }
    return new Token(TokenType.NUMBER, stringBuffer);
  }

  private consumeColor() : Token {
    //TODO: valid chars: a-f, 0-9
    let stringBuffer = '#';
    while(this.stylesheet[this.currentStreamPosition] !== ';') {
      stringBuffer += this.stylesheet[this.currentStreamPosition];
      this.currentStreamPosition++;
    }
    return new Token(TokenType.COLOR, stringBuffer);
  }
}

export class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
}