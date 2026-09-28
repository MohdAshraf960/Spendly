import type {
  CreateExpenseInput,
  Expense,
  ExpenseQuery,
} from '../entities/expense';

export interface ExpenseRepository {
  add(input: CreateExpenseInput): Expense;
  getById(id: string): Expense | undefined;
  update(id: string, input: CreateExpenseInput): Expense | undefined;
  delete(id: string): void;
  getAllLatestFirst(): Expense[];
  getLatestFirst(query?: ExpenseQuery): Expense[];
  subscribe(
    onChange: (expenses: Expense[]) => void,
    query?: ExpenseQuery,
  ): () => void;
}
