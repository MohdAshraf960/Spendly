import type {StoredCategory} from './category';

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

// List query. Dates are applied inclusive of the selected day.
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
