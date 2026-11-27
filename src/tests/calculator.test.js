const {
  calculate,
  main,
  modulo,
  parseNumber,
  power,
  squareRoot,
} = require('../calculator');

describe('calculate', () => {
  describe('basic operations', () => {
    test.each([
      ['addition', 2, '+', 3, 5],
      ['subtraction', 10, '-', 4, 6],
      ['multiplication', 45, '*', 2, 90],
      ['division', 20, '/', 5, 4],
      ['modulo', 5, '%', 2, 1],
      ['power', 2, '^', 3, 8],
    ])('%s', (_operation, left, operator, right, expected) => {
      expect(calculate(left, operator, right)).toBe(expected);
    });
  });

  test('handles negative and decimal operands', () => {
    expect(calculate(-2.5, '+', 1.5)).toBe(-1);
    expect(calculate(-8, '*', -2)).toBe(16);
    expect(calculate(7, '/', 2)).toBe(3.5);
  });

  test('throws when dividing by zero', () => {
    expect(() => calculate(20, '/', 0)).toThrow('Cannot divide by zero.');
  });

  test('throws for unsupported operations', () => {
    expect(() => calculate(2, '&', 3)).toThrow(
      'Unsupported operation "&". Use +, -, *, /, %, or ^.',
    );
  });
});

describe('additional operations', () => {
  test('modulo returns the remainder', () => {
    expect(modulo(5, 2)).toBe(1);
  });

  test('modulo rejects a zero divisor', () => {
    expect(() => modulo(17, 0)).toThrow('Cannot calculate modulo by zero.');
  });

  test('power raises a base to an exponent', () => {
    expect(power(2, 3)).toBe(8);
  });

  test('square root returns the root of a non-negative number', () => {
    expect(squareRoot(16)).toBe(4);
  });

  test('square root rejects negative numbers', () => {
    expect(() => squareRoot(-1)).toThrow(
      'Cannot calculate the square root of a negative number.',
    );
  });
});

describe('parseNumber', () => {
  test('parses valid integers and decimals', () => {
    expect(parseNumber('42', 'operand')).toBe(42);
    expect(parseNumber('-3.5', 'operand')).toBe(-3.5);
  });

  test.each(['', 'abc', 'Infinity', '-Infinity'])(
    'rejects non-finite value %j',
    (value) => {
      expect(() => parseNumber(value, 'The first operand')).toThrow(
        'The first operand must be a finite number.',
      );
    },
  );
});

describe('main', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test.each([
    [['2', '+', '3'], 5],
    [['10', '-', '4'], 6],
    [['45', '*', '2'], 90],
    [['20', '/', '5'], 4],
    [['5', '%', '2'], 1],
    [['2', '^', '3'], 8],
  ])('prints the result for %j', (args, expected) => {
    main(args);

    expect(logSpy).toHaveBeenCalledWith(expected);
  });

  test('rejects an incorrect number of arguments', () => {
    expect(() => main(['2', '+'])).toThrow(
      'Usage: node src/calculator.js <number> <operator> <number>',
    );
  });

  test('rejects division by zero', () => {
    expect(() => main(['20', '/', '0'])).toThrow('Cannot divide by zero.');
  });
});
