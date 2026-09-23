import {formatInr, formatInrCompact} from '../../../src/shared/utils/formatCurrency';

describe('formatInr', () => {
  it.each([
    [0, '₹0'],
    [12, '₹12'],
    [1000, '₹1,000'],
    [100000, '₹1,00,000'],
  ])('formats %s with an INR prefix', (amount, expected) => {
    expect(formatInr(amount)).toBe(expected);
  });
});

describe('formatInrCompact', () => {
  it('uses full INR below 1000', () => {
    expect(formatInrCompact(999)).toBe(formatInr(999));
  });

  it.each([
    [1000, '₹1k'],
    [9959, '₹9.95k'],
    [10000, '₹10k'],
    [100000, '₹1L'],
    [150000, '₹1.5L'],
    [10000000, '₹1Cr'],
    [25500000, '₹2.55Cr'],
  ])('compacts %s', (amount, expected) => {
    expect(formatInrCompact(amount)).toBe(expected);
  });

  it('truncates instead of rounding into the next unit', () => {
    expect(formatInrCompact(9959)).toBe('₹9.95k');
    expect(formatInrCompact(9959)).not.toBe('₹9.96k');
  });
});
