
const { tokenize } = require('./lexer');
const { parseTokens } = require('./parser');
const { SemanticAnalyzer } = require('./semantic');
const readline = require('readline');

// Crear interfaz para entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
  console.log('ANALIZADOR SEMÁNTICO INTERACTIVO');
  console.log('====================================');
  console.log('Instrucciones:');
  console.log('- Escribe tu código línea por línea');
  console.log('- Escribe "ANALIZAR" para procesar el código');
  console.log('- Escribe "EJEMPLO" para usar código de ejemplo');
  console.log('- Escribe "SALIR" para terminar\n');

  let userCode = '';

  function askForInput() {
    rl.question('>>> ', (input) => {
      const command = input.trim().toUpperCase();

      if (command === 'SALIR') {
        console.log('¡Hasta luego!');
        rl.close();
        return;
      }

      if (command === 'ANALIZAR') {
        if (userCode.trim() === '') {
          console.log('No has ingresado ningún código. Escribe algo primero.\n');
        } else {
          console.log('\n' + '='.repeat(50));
          console.log('ANALIZANDO TU CÓDIGO...');
          console.log('='.repeat(50));
          analyzeCode(userCode);
          userCode = ''; // Limpiar para próximo análisis
          console.log('\n' + '='.repeat(50));
          console.log('¿Quieres analizar más código? Escribe nuevas líneas o "SALIR"');
        }
        askForInput();
        return;
      }

      if (command === 'EJEMPLO') {
        userCode = ejemploCodigo;
        console.log('Código de ejemplo cargado. Escribe "ANALIZAR" para procesarlo.\n');
        askForInput();
        return;
      }

      // Agregar línea al código del usuario
      userCode += input + '\n';
      askForInput();
    });
  }

  askForInput();
}

// Exportar función para uso como módulo
module.exports = { analyzeCode };
