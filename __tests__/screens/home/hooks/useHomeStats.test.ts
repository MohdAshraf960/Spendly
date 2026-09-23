import {act, renderHook} from '@testing-library/react-native';
import {resetMockRealm} from '../../../../__mock__/realm';
import {expenseRepository} from '../../../../src/repositories';
import {getHomeStats, useLedgerStats} from '../../../../src/screens/home/hooks/useHomeStats';
import type {Expense} from '../../../../src/types';

const expense = (
  overrides: Partial<Expense> = {},
): Expense => ({
  id: 'expense-1',
  title: 'Milk',
  amount: 40,
  category: {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurants',
    imagePath: 'food.webp',
  },
  date: new Date('2026-09-23T10:00:00'),
  note: '',
  createdAt: new Date('2026-09-23T10:00:00'),
  ...overrides,
});

describe('getHomeStats', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-23T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sums spending, keeps income out of totals, and counts every row', () => {
    const stats = getHomeStats([
      expense({id: '1', amount: 40}),
      expense({
        id: '2',
        amount: 100,
        date: new Date('2026-08-01T10:00:00'),
      }),
      expense({
        id: '3',
        amount: 500,
        category: {
          id: 'income',
          name: 'Income',
          description: 'Salary',
          imagePath: 'income.webp',
        },
      }),
    ]);

    expect(stats).toEqual({
      allTimeTotal: 140,
      thisMonthTotal: 40,
      transactionCount: 3,
    });
  });
});

describe('useLedgerStats', () => {
  beforeEach(() => {
    resetMockRealm();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-23T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reads the full ledger and updates after a new expense', async () => {
    expenseRepository.add({
      title: 'Milk',
      amount: 40,
      category: {
        id: 'food',
        name: 'Food',
        description: 'Dining',
        imagePath: 'food.webp',
      },
      date: new Date('2026-09-23T10:00:00'),
      note: '',
    });
    const {result} = await renderHook(() => useLedgerStats());

    expect(result.current).toMatchObject({
      allTimeTotal: 40,
      thisMonthTotal: 40,
      transactionCount: 1,
    });

    await act(async () => {
      expenseRepository.add({
        title: 'Salary',
        amount: 500,
        category: {
          id: 'income',
          name: 'Income',
          description: 'Salary',
          imagePath: 'income.webp',
        },
        date: new Date('2026-09-23T11:00:00'),
        note: '',
      });
    });

    expect(result.current).toMatchObject({
      allTimeTotal: 40,
      transactionCount: 2,
    });
  });
});
