#!/usr/bin/env node

/**
 * Node.js CLI calculator.
 *
 * Supported operations:
 *   +  Addition
 *   -  Subtraction
 *   *  Multiplication
 *   /  Division
 *
 * Usage:
 *   node src/calculator.js <number> <operator> <number>
 *   node src/calculator.js 12 + 3
 */

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
};

function calculate(left, operator, right) {
  if (!Object.hasOwn(OPERATIONS, operator)) {
    throw new Error(`Unsupported operation "${operator}". Use +, -, *, or /.`);
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
  if (args.length !== 3) {
    throw new Error(
      'Usage: node src/calculator.js <number> <operator> <number>',
    );
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

module.exports = { calculate, main, parseNumber };
