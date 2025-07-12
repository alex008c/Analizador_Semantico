function parseTokens(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    // Declaración de variable con 'let'
    if (token.type === 'KEYWORD' && token.value === 'let') {
      current++;
      let identifier = tokens[current++];
      current++; // saltar '='
      let value = parseExpression();
      current++; // saltar ';'

      return {
        type: 'VariableDeclaration',
        id: identifier.value,
        value: value,
      };
    }

    // Llamada a función (print)
    if (token.type === 'KEYWORD' && token.value === 'print') {
      current++;
      current++; // saltar '('
      let argument = parseExpression();
      current++; // saltar ')'
      current++; // saltar ';'

      return {
        type: 'FunctionCall',
        name: 'print',
        arguments: [argument],
      };
    }

    // Estructura condicional 'if'
    if (token.type === 'KEYWORD' && token.value === 'if') {
      current++;
      let condition = parseExpression();
      current++; // saltar '{'

      let body = [];
      while (tokens[current] && tokens[current].value !== '}') {
        body.push(walk());
      }
      current++; // saltar '}'

      return {
        type: 'IfStatement',
        condition: condition,
        body: body,
      };
    }

    // Asignación de variable
    if (token.type === 'IDENTIFIER') {
      let identifier = token.value;
      current++;
      if (tokens[current] && tokens[current].value === '=') {
        current++; // saltar '='
        let value = parseExpression();
        current++; // saltar ';'

        return {
          type: 'Assignment',
          id: identifier,
          value: value,
        };
      }
    }

    throw new TypeError('Token inesperado: ' + JSON.stringify(token));
  }

  function parseExpression() {
    let left = parsePrimary();

    // Manejar operadores binarios
    while (tokens[current] && tokens[current].type === 'OPERATOR') {
      let operator = tokens[current++];
      let right = parsePrimary();

      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left: left,
        right: right,
      };
    }

    return left;
  }

  function parsePrimary() {
    let token = tokens[current];

    if (token.type === 'NUMBER') {
      current++;
      return {
        type: 'Literal',
        valueType: 'number',
        value: parseInt(token.value),
      };
    }

    if (token.type === 'STRING') {
      current++;
      return {
        type: 'Literal',
        valueType: 'string',
        value: token.value,
      };
    }

    if (token.type === 'IDENTIFIER') {
      current++;
      return {
        type: 'Identifier',
        name: token.value,
      };
    }

    throw new TypeError('Token inesperado en expresión: ' + JSON.stringify(token));
  }

  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

module.exports = { parseTokens };
