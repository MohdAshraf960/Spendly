import {resetMockRealm} from '../../__mock__/realm';
import {expenseRepository} from '../../src/repositories';
import type {CreateExpenseInput} from '../../src/types/expense';

const food = {
  id: 'food',
  name: 'Food & Dining',
  description: 'Restaurants, cafes, takeout',
  imagePath: 'assets/categories/food_and_drink.webp',
};

const fuel = {
  id: 'fuel',
  name: 'Fuel & Transport',
  description: 'Uber, metro, fuel',
  imagePath: 'assets/categories/fuel_transport.webp',
};

const expense = (
  overrides: Partial<CreateExpenseInput> = {},
): CreateExpenseInput => ({
  title: 'Milk',
  amount: 42,
  category: food,
  date: new Date('2026-09-22T14:05:00'),
  note: '',
  ...overrides,
});

describe('expenseRepository', () => {
  beforeEach(() => {
    resetMockRealm();
  });

  it('adds an expense that can be read back by id', () => {
    const created = expenseRepository.add(expense());

    expect(created.id).toEqual(expect.any(String));
    expect(expenseRepository.getById(created.id)).toMatchObject({
      id: created.id,
      title: 'Milk',
      amount: 42,
      category: food,
      note: '',
    });
  });

  it('returns undefined for an unknown id', () => {
    expect(expenseRepository.getById('missing')).toBeUndefined();
  });

  it('updates fields and the embedded category', () => {
    const created = expenseRepository.add(expense());

    const updated = expenseRepository.update(
      created.id,
      expense({
        title: 'Metro',
        amount: 30,
        category: fuel,
        note: 'card',
        date: new Date('2026-09-23T09:00:00'),
      }),
    );

    expect(updated).toMatchObject({
      id: created.id,
      title: 'Metro',
      amount: 30,
      note: 'card',
      category: fuel,
    });
    expect(expenseRepository.getById(created.id)?.category.id).toBe('fuel');
  });

  it('returns undefined when updating a missing expense', () => {
    expect(expenseRepository.update('missing', expense())).toBeUndefined();
  });

  it('deletes an expense and ignores an unknown id', () => {
    const created = expenseRepository.add(expense());

    expenseRepository.delete(created.id);
    expenseRepository.delete('missing');

    expect(expenseRepository.getById(created.id)).toBeUndefined();
  });

  it('returns the newest expense first', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-22T10:00:00'));
    const older = expenseRepository.add(expense({title: 'Older'}));
    jest.setSystemTime(new Date('2026-09-22T10:00:01'));
    const newer = expenseRepository.add(expense({title: 'Newer'}));
    jest.useRealTimers();

    expect(expenseRepository.getLatestFirst().map(item => item.id)).toEqual([
      newer.id,
      older.id,
    ]);
    expect(expenseRepository.getAllLatestFirst().map(item => item.title)).toEqual([
      'Newer',
      'Older',
    ]);
  });

  it('filters by search, category, and inclusive dates', () => {
    expenseRepository.add(expense({title: 'Milk'}));
    expenseRepository.add(
      expense({
        title: 'Metro card',
        category: fuel,
        date: new Date('2026-09-21T08:00:00'),
      }),
    );

    expect(
      expenseRepository.getLatestFirst({search: '  milk '}).map(item => item.title),
    ).toEqual(['Milk']);
    expect(
      expenseRepository.getLatestFirst({categoryIds: ['fuel']}).map(item => item.title),
    ).toEqual(['Metro card']);
    expect(
      expenseRepository
        .getLatestFirst({
          fromDate: new Date('2026-09-22T00:00:00'),
          endDate: new Date('2026-09-22T00:00:00'),
        })
        .map(item => item.title),
    ).toEqual(['Milk']);
  });

  it('notifies subscribers after a write and stops after unsubscribe', () => {
    const onChange = jest.fn();
    const unsubscribe = expenseRepository.subscribe(onChange);

    expenseRepository.add(expense({title: 'Tea'}));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].map((item: {title: string}) => item.title)).toEqual([
      'Tea',
    ]);

    unsubscribe();
    expenseRepository.add(expense({title: 'Coffee'}));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
