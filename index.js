
const { tokenize } = require('./lexer');
const { parseTokens } = require('./parser');
const { SemanticAnalyzer } = require('./semantic');

// Función principal del analizador semántico
function analyzeCode(sourceCode) {
  console.log('ANALIZADOR SEMÁNTICO DE COMPILADOR');
  console.log('=====================================\n');

  try {
    // Paso 1: Análisis Léxico
    console.log('PASO 1: ANÁLISIS LÉXICO');
    console.log('Código fuente:');
    console.log(sourceCode);
    console.log('\nTokens generados:');

    const tokens = tokenize(sourceCode);
    console.table(tokens);

    // Paso 2: Análisis Sintáctico
    console.log('\nPASO 2: ANÁLISIS SINTÁCTICO');
    const ast = parseTokens(tokens);
    console.log('AST generado:');
    console.log(JSON.stringify(ast, null, 2));

    // Paso 3: Análisis Semántico
    console.log('\nPASO 3: ANÁLISIS SEMÁNTICO');
    const analyzer = new SemanticAnalyzer();
    const result = analyzer.analyze(ast);

    // Reporte final
    console.log('\nREPORTE FINAL');
    const report = analyzer.generateReport();

    if (report.isValid) {
      console.log('\n¡ANÁLISIS COMPLETADO CON ÉXITO!');
      console.log('El código es semánticamente correcto.');
    } else {
      console.log('\nANÁLISIS COMPLETADO CON ERRORES');
      console.log('Se encontraron errores semánticos en el código.');
    }

    return result;

  } catch (error) {
    console.error('\nERROR DURANTE EL ANÁLISIS:');
    console.error(error.message);
    return null;
  }
}

// Código de ejemplo para probar
const ejemploCodigo = `
let numero = 42;
let mensaje = "Hola, mundo!";
print(mensaje);

if numero > 40 {
  numero = numero + 8;
  print("El número es mayor que 40");
}

let resultado = numero * 2;
`;

// Ejecutar análisis si el archivo se ejecuta directamente
if (require.main === module) {
  console.log('Ejecutando análisis con código de ejemplo...\n');
  analyzeCode(ejemploCodigo);
}

// Exportar función para uso como módulo
module.exports = { analyzeCode };
