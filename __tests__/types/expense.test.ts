import type {
  CreateExpenseInput,
  Expense,
  ExpenseQuery,
  StoredCategory,
} from '../../src/types';

const category = {
  id: 'food',
  name: 'Food & Dining',
  description: 'Restaurants, cafes, takeout',
  imagePath: 'assets/categories/food_and_drink.webp',
} satisfies StoredCategory;

const input = {
  title: 'Milk',
  amount: 42,
  category,
  date: new Date('2026-09-22T14:05:00'),
  note: 'store',
} satisfies CreateExpenseInput;

const expense = {
  id: 'expense-1',
  createdAt: new Date('2026-09-22T14:06:00'),
  ...input,
} satisfies Expense;

describe('StoredCategory', () => {
  it('keeps the id, name, description, and image path', () => {
    expect(category).toEqual({
      id: 'food',
      name: 'Food & Dining',
      description: 'Restaurants, cafes, takeout',
      imagePath: 'assets/categories/food_and_drink.webp',
    });
  });
});

describe('CreateExpenseInput', () => {
  it('keeps a positive amount, category, date, and note', () => {
    expect(input.title).toBe('Milk');
    expect(input.amount).toBe(42);
    expect(input.category.id).toBe('food');
    expect(input.date).toBeInstanceOf(Date);
    expect(input.note).toBe('store');
  });
});

describe('Expense', () => {
  it('adds an id and createdAt to the input', () => {
    expect(expense.id).toBe('expense-1');
    expect(expense.createdAt).toBeInstanceOf(Date);
    expect(expense).toMatchObject({
      title: 'Milk',
      amount: 42,
      note: 'store',
    });
  });
});

describe('ExpenseQuery', () => {
  it('allows an empty query', () => {
    const query = {} satisfies ExpenseQuery;

    expect(query.search).toBeUndefined();
    expect(query.categoryIds).toBeUndefined();
    expect(query.fromDate).toBeUndefined();
    expect(query.endDate).toBeUndefined();
  });

  it('carries search, categories, and date bounds', () => {
    const query = {
      search: 'milk',
      categoryIds: ['food'],
      fromDate: new Date('2026-09-01T00:00:00'),
      endDate: new Date('2026-09-22T00:00:00'),
    } satisfies ExpenseQuery;

    expect(query).toMatchObject({
      search: 'milk',
      categoryIds: ['food'],
    });
    expect(query.fromDate).toBeInstanceOf(Date);
    expect(query.endDate).toBeInstanceOf(Date);
  });
});
