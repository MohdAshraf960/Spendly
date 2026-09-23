import {
  formatExpenseDateTitle,
  formatExpenseShortDate,
  formatExpenseTime,
} from '../../../src/shared/utils/formatDate';

describe('formatExpenseDateTitle', () => {
  const now = new Date('2026-09-22T12:00:00');

  beforeEach(() => {
    jest.useFakeTimers({now});
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('prefixes today with Today,', () => {
    expect(formatExpenseDateTitle(now)).toMatch(/^Today, /);
  });

  it('omits Today for a different calendar day', () => {
    const yesterday = new Date('2026-09-21T12:00:00');
    expect(formatExpenseDateTitle(yesterday)).not.toMatch(/^Today,/);
    expect(formatExpenseDateTitle(yesterday)).toMatch(/21/);
  });
});

describe('formatExpenseTime', () => {
  it('returns hours and minutes', () => {
    expect(formatExpenseTime(new Date('2026-09-22T09:05:00'))).toMatch(
      /\d{1,2}:\d{2}/,
    );
  });
});

describe('formatExpenseShortDate', () => {
  it('includes month, day, and year', () => {
    expect(formatExpenseShortDate(new Date('2026-01-15T00:00:00'))).toMatch(
      /Jan.*15.*2026/,
    );
  });
});
