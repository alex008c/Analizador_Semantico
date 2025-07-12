const { tokenize } = require('./lexer');
const { parseTokens } = require('./parser');
const { SemanticAnalyzer } = require('./semantic');

function testCode(description, code) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${description}`);
  console.log(`${'='.repeat(60)}`);

  console.log('\n--- CÓDIGO A ANALIZAR ---');
  console.log(code);

  try {
    console.log('\n--- TOKENS ---');
    const tokens = tokenize(code);
    console.log(tokens);

    console.log('\n--- AST ---');
    const ast = parseTokens(tokens);
    console.log(JSON.stringify(ast, null, 2));

    console.log('\n--- ANÁLISIS SEMÁNTICO ---');
    const analyzer = new SemanticAnalyzer();
    const semanticResult = analyzer.analyze(ast);

    console.log('\n--- REPORTE FINAL ---');
    const report = analyzer.generateReport();

    if (report.isValid) {
      console.log('\nEl código es semánticamente correcto!');
    } else {
      console.log('\nEl código tiene errores semánticos.');
    }
  } catch (error) {
    console.log('\nERROR EN EL ANÁLISIS:');
    console.log(error.message);
  }
}

// PRUEBA 1
const codigoCorrecto = `
let x = 10;
print("Hola mundo");
if x > 5 {
  x = x + 1;
}
`;

// PRUEBA 2
const codigoConErrores = `
let numero = 42;
let texto = "Hola";
print(variableNoDeclarada);
if texto + numero > 10 {
  otraVariableNoDeclarada = 5;
}
let duplicada = 1;
let duplicada = 2;
`;

testCode('PRUEBA 1: ', codigoCorrecto);
testCode('PRUEBA 2: ', codigoConErrores);
