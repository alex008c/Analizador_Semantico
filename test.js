const { tokenize } = require('./lexer');

const code = `
let x = 10;
print("Hola mundo");
if x > 5 {
  x = x + 1;
}
`;

const tokens = tokenize(code);
console.log(tokens);
