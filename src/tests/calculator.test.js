const {
  calculate,
  main,
  parseNumber,
  modulo,
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
      ['remainder', 20, '%', 6, 2],
      ['exponentiation', 2, '**', 3, 8],
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
    expect(() => calculate(2, '?', 3)).toThrow(
      'Unsupported operation "?". Use +, -, *, /, %, **, or sqrt.',
    );
  });
});

describe('extended operations', () => {
  test('calculates remainders for negative and decimal operands', () => {
    expect(modulo(-7, 3)).toBe(-1);
    expect(modulo(5.5, 2)).toBe(1.5);
  });

  test('rejects a zero divisor and invalid operands', () => {
    expect(() => modulo(2, 0)).toThrow('Cannot calculate remainder with a zero divisor.');
    expect(() => modulo(2, -0)).toThrow('Cannot calculate remainder with a zero divisor.');
    expect(() => modulo(Infinity, 2)).toThrow('Operands must be finite numbers.');
  });

  test('calculates zero, negative and fractional powers', () => {
    expect(power(5, 0)).toBe(1);
    expect(power(2, -2)).toBe(0.25);
    expect(power(9, 0.5)).toBe(3);
  });

  test('rejects invalid or non-finite powers', () => {
    expect(() => power(-1, 0.5)).toThrow('Power result must be a finite real number.');
    expect(() => power(0, -1)).toThrow('Power result must be a finite real number.');
    expect(() => power(10, 1000)).toThrow('Power result must be a finite real number.');
    expect(() => power(2, Infinity)).toThrow('Operands must be finite numbers.');
  });

  test('calculates square roots', () => {
    expect(squareRoot(0)).toBe(0);
    expect(squareRoot(2.25)).toBe(1.5);
    expect(calculate(9, 'sqrt')).toBe(3);
  });

  test('rejects negative and non-finite square root operands', () => {
    expect(() => squareRoot(-1)).toThrow('Cannot calculate the square root of a negative number.');
    expect(() => squareRoot(NaN)).toThrow('Operand must be a finite number.');
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
    [['20', '%', '6'], 2],
    [['2', '**', '3'], 8],
    [['sqrt', '9'], 3],
  ])('prints the result for %j', (args, expected) => {
    main(args);

    expect(logSpy).toHaveBeenCalledWith(expected);
  });

  test('rejects an incorrect number of arguments', () => {
    expect(() => main(['2', '+'])).toThrow(
      'Usage: node src/calculator.js <number> <operator> <number> or node src/calculator.js sqrt <number>',
    );
  });

  test('rejects division by zero', () => {
    expect(() => main(['20', '/', '0'])).toThrow('Cannot divide by zero.');
  });

  test('rejects invalid extended operations', () => {
    expect(() => main(['20', '%', '0'])).toThrow('Cannot calculate remainder with a zero divisor.');
    expect(() => main(['-1', '**', '0.5'])).toThrow('Power result must be a finite real number.');
    expect(() => main(['sqrt', '-1'])).toThrow('Cannot calculate the square root of a negative number.');
    expect(() => main(['sqrt', ''])).toThrow('The operand must be a finite number.');
    expect(() => main(['9', 'sqrt', '2'])).toThrow('Square root requires exactly one operand: sqrt <number>.');
  });
});
