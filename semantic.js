// Analizador Semántico
class SemanticAnalyzer {
  constructor() {
    this.symbolTable = new Map();
    this.errors = [];
    this.warnings = [];
  }

  analyze(ast) {
    this.errors = [];
    this.warnings = [];
    this.symbolTable.clear();

    console.log('=== ANÁLISIS SEMÁNTICO ===');
    this.analyzeProgram(ast);

    return {
      symbolTable: Object.fromEntries(this.symbolTable),
      errors: this.errors,
      warnings: this.warnings,
      isValid: this.errors.length === 0
    };
  }

  analyzeProgram(ast) {
    if (ast.type !== 'Program') {
      this.addError('El nodo raíz debe ser de tipo Program');
      return;
    }

    console.log('Analizando programa...');

    for (let statement of ast.body) {
      this.analyzeStatement(statement);
    }

    this.checkUnusedVariables();
  }

  analyzeStatement(statement) {
    switch (statement.type) {
      case 'VariableDeclaration':
        this.analyzeVariableDeclaration(statement);
        break;
      case 'Assignment':
        this.analyzeAssignment(statement);
        break;
      case 'FunctionCall':
        this.analyzeFunctionCall(statement);
        break;
      case 'IfStatement':
        this.analyzeIfStatement(statement);
        break;
      default:
        this.addError(`Tipo de declaración desconocido: ${statement.type}`);
    }
  }

  analyzeVariableDeclaration(statement) {
    const varName = statement.id;

    console.log(`Declarando variable: ${varName}`);

    if (this.symbolTable.has(varName)) {
      this.addError(`Variable '${varName}' ya fue declarada anteriormente`);
      return;
    }

    const valueType = this.analyzeExpression(statement.value);

    this.symbolTable.set(varName, {
      type: valueType,
      declared: true,
      used: false,
      line: statement.line || 'unknown'
    });

    console.log(`Variable '${varName}' declarada con tipo: ${valueType}`);
  }

  analyzeAssignment(statement) {
    const varName = statement.id;

    console.log(`Asignando valor a variable: ${varName}`);

    if (!this.symbolTable.has(varName)) {
      this.addError(`Variable '${varName}' no ha sido declarada`);
      return;
    }

    const valueType = this.analyzeExpression(statement.value);
    const variable = this.symbolTable.get(varName);

    if (variable.type !== valueType) {
      this.addWarning(`Posible incompatibilidad de tipos: variable '${varName}' es de tipo ${variable.type}, pero se le asigna un valor de tipo ${valueType}`);
    }

    variable.used = true;
    this.symbolTable.set(varName, variable);
  }

  analyzeFunctionCall(statement) {
    const functionName = statement.name;

    console.log(`Llamada a función: ${functionName}`);

    const knownFunctions = ['print', 'console', 'alert'];
    if (!knownFunctions.includes(functionName)) {
      this.addWarning(`Función '${functionName}' no está definida en el sistema`);
    }

    for (let arg of statement.arguments) {
      this.analyzeExpression(arg);
    }

    if (functionName === 'print') {
      if (statement.arguments.length !== 1) {
        this.addError(`La función 'print' espera exactamente 1 argumento, pero se proporcionaron ${statement.arguments.length}`);
      }
    }
  }

  analyzeIfStatement(statement) {
    console.log('Analizando declaración if...');

    const conditionType = this.analyzeExpression(statement.condition);

    if (conditionType !== 'boolean') {
      this.addWarning(`La condición del 'if' debería evaluar a un booleano, pero es de tipo ${conditionType}`);
    }

    for (let bodyStatement of statement.body) {
      this.analyzeStatement(bodyStatement);
    }
  }

  analyzeExpression(expression) {
    switch (expression.type) {
      case 'Literal':
        return this.analyzeLiteral(expression);
      case 'Identifier':
        return this.analyzeIdentifier(expression);
      case 'BinaryExpression':
        return this.analyzeBinaryExpression(expression);
      default:
        this.addError(`Tipo de expresión desconocido: ${expression.type}`);
        return 'unknown';
    }
  }

  analyzeLiteral(expression) {
    return expression.valueType;
  }

  analyzeIdentifier(expression) {
    const varName = expression.name;

    if (!this.symbolTable.has(varName)) {
      this.addError(`Variable '${varName}' no ha sido declarada`);
      return 'unknown';
    }

    const variable = this.symbolTable.get(varName);
    variable.used = true;
    this.symbolTable.set(varName, variable);

    return variable.type;
  }

  analyzeBinaryExpression(expression) {
    const leftType = this.analyzeExpression(expression.left);
    const rightType = this.analyzeExpression(expression.right);
    const operator = expression.operator;

    console.log(`Expresión binaria: ${leftType} ${operator} ${rightType}`);

    switch (operator) {
      case '+':
      case '-':
      case '*':
      case '/':
        if (leftType !== 'number' || rightType !== 'number') {
          this.addError(`Operador aritmético '${operator}' requiere operandos numéricos, pero se encontraron: ${leftType} y ${rightType}`);
          return 'unknown';
        }
        return 'number';

      case '>':
      case '<':
      case '>=':
      case '<=':
        if (leftType !== rightType) {
          this.addWarning(`Comparación entre tipos diferentes: ${leftType} y ${rightType}`);
        }
        return 'boolean';

      case '==':
      case '!=':
        if (leftType !== rightType) {
          this.addWarning(`Comparación de igualdad entre tipos diferentes: ${leftType} y ${rightType}`);
        }
        return 'boolean';

      default:
        this.addError(`Operador desconocido: ${operator}`);
        return 'unknown';
    }
  }

  checkUnusedVariables() {
    for (let [varName, varInfo] of this.symbolTable) {
      if (!varInfo.used) {
        this.addWarning(`Variable '${varName}' fue declarada pero nunca utilizada`);
      }
    }
  }

  addError(message) {
    this.errors.push({
      type: 'Error',
      message: message,
      timestamp: new Date().toISOString()
    });
    console.log(`ERROR: ${message}`);
  }

  addWarning(message) {
    this.warnings.push({
      type: 'Warning',
      message: message,
      timestamp: new Date().toISOString()
    });
    console.log(`WARNING: ${message}`);
  }

  generateReport() {
    console.log('\n=== REPORTE SEMÁNTICO ===');
    console.log(`Total de errores: ${this.errors.length}`);
    console.log(`Total de advertencias: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n ERRORES:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n ADVERTENCIAS:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.message}`);
      });
    }

    console.log('\n TABLA DE SÍMBOLOS:');
    if (this.symbolTable.size === 0) {
      console.log('No hay variables declaradas.');
    } else {
      for (let [varName, varInfo] of this.symbolTable) {
        console.log(`- ${varName}: tipo=${varInfo.type}, usado=${varInfo.used ? 'SI' : 'NO'}`);
      }
    }

    return {
      isValid: this.errors.length === 0,
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length
    };
  }
}

module.exports = { SemanticAnalyzer };