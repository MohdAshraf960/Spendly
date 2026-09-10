import type {Category} from '../../../shared/data/categories';

export type AddExpenseValues = {
  title: string;
  amount: string;
  category?: Category;
};

export type AddExpenseErrors = {
  title?: string;
  amount?: string;
  category?: string;
};

// Title, amount > 0, and category are required. Note and date are optional.
export const validateAddExpense = ({
  title,
  amount,
  category,
}: AddExpenseValues): AddExpenseErrors => {
  const errors: AddExpenseErrors = {};

  if (!title.trim()) {
    errors.title = 'Expense title is required';
  }

  if (!amount.trim()) {
    errors.amount = 'Expense amount is required';
  } else if (!(Number(amount) > 0)) {
    errors.amount = 'Enter a valid amount';
  }

  if (!category) {
    errors.category = 'Select a category';
  }

  return errors;
};

export const hasAddExpenseErrors = (errors: AddExpenseErrors) =>
  Object.values(errors).some(Boolean);
