class AST {
  type: string;

  constructor(nodeType: string) {
    this.type = nodeType;
  }
} 

export class Parser {
  parse(program: string) : AST {
    return new AST('Stylesheet');
  }
}