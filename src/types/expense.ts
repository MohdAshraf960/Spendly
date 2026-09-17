import type {StoredCategory} from '../shared/data/categories';

export type {StoredCategory};

// Amounts stay positive. Income vs spend is decided by category id.
export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: StoredCategory;
  date: Date;
  note: string;
  createdAt: Date;
};

// Realm list query. Dates are applied inclusive of the selected day.
export type ExpenseQuery = {
  search?: string;
  categoryIds?: string[];
  fromDate?: Date;
  endDate?: Date;
};

export type CreateExpenseInput = {
  title: string;
  amount: number;
  category: StoredCategory;
  date: Date;
  note: string;
};
