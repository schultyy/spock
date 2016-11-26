export const LBRACKET = 'LBRACKET';
export const RBRACKET = 'RBRACKET';
export const EOF = 'EOF';

export class Lexer {
  stylesheet: string;
  currentStreamPosition: number;

  constructor(stylesheet: string) {
    this.stylesheet = stylesheet;
    this.currentStreamPosition = 0;
  }

  static isChar(ch: string) : boolean {
    return !!ch.match(/[a-z]/i);
  }

  static isWhitespace(ch: string) : boolean {
    return !!ch.match(/\w/);
  }

  nextToken() : Token {
    const charStream = this.stylesheet.split(' ');

    while(this.currentStreamPosition < charStream.length) {
      let currentChar = charStream[this.currentStreamPosition++];
      switch(currentChar) {
        case '{':
         return new Token(LBRACKET, '{');
        case '}':
          return new Token(RBRACKET, '}');
        default:
          if(Lexer.isChar(currentChar)) {
          } else if (Lexer.isWhitespace(currentChar)) {
          }
      }
    }
    return new Token(EOF, "<<EOF>>");
  }
}

export class Token {
  type: string;
  value: string;

  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}