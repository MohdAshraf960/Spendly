import type {Category} from '../../src/shared/data/categories';
import {
  hasAddExpenseErrors,
  validateAddExpense,
} from '../../src/validation/validateAddExpense';

const groceries: Category = {
  id: 'groceries',
  name: 'Groceries & Daily Supplies',
  description: 'Pantry',
  imagePath: 'assets/categories/health_grocrey_icon.webp',
  image: 1,
};

describe('validateAddExpense', () => {
  it('requires a trimmed title, a positive amount, and a category', () => {
    expect(validateAddExpense({title: '  ', amount: '', category: undefined})).toEqual({
      title: 'Expense title is required',
      amount: 'Expense amount is required',
      category: 'Select a category',
    });
  });

  it('rejects zero and non-numeric amounts', () => {
    expect(
      validateAddExpense({title: 'Milk', amount: '0', category: groceries}).amount,
    ).toBe('Enter a valid amount');
    expect(
      validateAddExpense({title: 'Milk', amount: 'abc', category: groceries}).amount,
    ).toBe('Enter a valid amount');
  });

  it('accepts a valid expense', () => {
    expect(
      validateAddExpense({
        title: ' Milk ',
        amount: '42.5',
        category: groceries,
      }),
    ).toEqual({});
  });
});

describe('hasAddExpenseErrors', () => {
  it('is true when any field has a message', () => {
    expect(hasAddExpenseErrors({title: 'Expense title is required'})).toBe(true);
    expect(hasAddExpenseErrors({})).toBe(false);
  });
});
