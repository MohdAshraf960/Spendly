import type {StoredCategory} from '../../../shared/data/categories';

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

export type CreateExpenseInput = {
  title: string;
  amount: number;
  category: StoredCategory;
  date: Date;
  note: string;
};
