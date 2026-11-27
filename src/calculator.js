#!/usr/bin/env node

/**
 * Node.js CLI calculator.
 *
 * Supported operations:
 *   +  Addition
 *   -  Subtraction
 *   *  Multiplication
 *   /  Division
 *   %  Remainder
 *   ** Exponentiation
 *   sqrt Square root
 *
 * Usage:
 *   node src/calculator.js <number> <operator> <number>
 *   node src/calculator.js sqrt <number>
 *   node src/calculator.js 12 + 3
 */

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Operands must be finite numbers.');
  }
  if (b === 0) {
    throw new Error('Cannot calculate remainder with a zero divisor.');
  }
  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new Error('Operands must be finite numbers.');
  }
  const result = base ** exponent;
  if (!Number.isFinite(result)) {
    throw new Error('Power result must be a finite real number.');
  }
  return result;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error('Operand must be a finite number.');
  }
  if (n < 0) {
    throw new Error('Cannot calculate the square root of a negative number.');
  }
  return Math.sqrt(n);
}

const OPERATIONS = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => {
    if (right === 0) {
      throw new Error('Cannot divide by zero.');
    }

    return left / right;
  },
  '%': modulo,
  '**': power,
  sqrt: squareRoot,
};

function calculate(left, operator, right) {
  if (!Object.hasOwn(OPERATIONS, operator)) {
    throw new Error(`Unsupported operation "${operator}". Use +, -, *, /, %, **, or sqrt.`);
  }

  return OPERATIONS[operator](left, right);
}

function parseNumber(value, name) {
  if (typeof value === 'string' && value.trim() === '') {
    throw new Error(`${name} must be a finite number.`);
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a finite number.`);
  }

  return number;
}

function main(args) {
  if (args.length === 2 && args[0] === 'sqrt') {
    const operand = parseNumber(args[1], 'The operand');
    console.log(calculate(operand, 'sqrt'));
    return;
  }

  if (args.length !== 3) {
    throw new Error(
      'Usage: node src/calculator.js <number> <operator> <number> or node src/calculator.js sqrt <number>',
    );
  }

  if (args[1] === 'sqrt') {
    throw new Error('Square root requires exactly one operand: sqrt <number>.');
  }

  const left = parseNumber(args[0], 'The first operand');
  const right = parseNumber(args[2], 'The second operand');
  const result = calculate(left, args[1], right);

  console.log(result);
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { calculate, main, parseNumber, modulo, power, squareRoot };
