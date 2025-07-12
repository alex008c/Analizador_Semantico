
function tokenize(input) {
  const tokens = [];
  const keywords = ["let", "if", "else", "print"];
  let i = 0;


  while (i < input.length) {
    const char = input[i];

    //Espacios
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    //Números
    if (/\d/.test(char)) {
      let num = '';
      while (/\d/.test(input[i])) {
        num += input[i++];
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // Identificadores o palabras clave
    if (/[a-zA-Z_]/.test(char)) {
      let ident = '';
      while (/[a-zA-Z0-9_]/.test(input[i])) {
        ident += input[i++];
      }
      if (keywords.includes(ident)) {
        tokens.push({ type: "KEYWORD", value: ident });
      } else {
        tokens.push({ type: "IDENTIFIER", value: ident });
      }
      continue;
    }

    // Cadenas de texto
    if (char === '"') {
      i++; // Salta la comilla inicial
      let str = '';
      while (input[i] !== '"' && i < input.length) {
        str += input[i++];
      }
      i++; // Salta la comilla final
      tokens.push({ type: "STRING", value: str });
      continue;
    }

    // Operadores y signos
    switch (char) {
      case '=':
      case '+':
      case '-':
      case '*':
      case '/':
      case '>':
      case '<':
        tokens.push({ type: "OPERATOR", value: char });
        break;
      case ';':
      case '(':
      case ')':
      case '{':
      case '}':
        tokens.push({ type: "DELIMITER", value: char });
        break;
      default:
        tokens.push({ type: "UNKNOWN", value: char });
        break;
    }

    i++;
  }

  return tokens;
}

// Exportamos la función
module.exports = { tokenize };