import type {
  CreateExpenseInput,
  Expense,
  ExpenseQuery,
} from '../entities/expense';
import type {ExpenseRepository} from '../repositories/expenseRepository';

export const createAddExpense =
  (expenses: ExpenseRepository) => (input: CreateExpenseInput) =>
    expenses.add(input);

export const createUpdateExpense =
  (expenses: ExpenseRepository) => (id: string, input: CreateExpenseInput) =>
    expenses.update(id, input);

export const createDeleteExpense =
  (expenses: ExpenseRepository) => (id: string) =>
    expenses.delete(id);

export const createGetExpense =
  (expenses: ExpenseRepository) => (id?: string) =>
    id ? expenses.getById(id) : undefined;

export const createGetExpenses =
  (expenses: ExpenseRepository) => (query: ExpenseQuery = {}) =>
    expenses.getLatestFirst(query);

export const createSubscribeToExpenses =
  (expenses: ExpenseRepository) =>
  (onChange: (items: Expense[]) => void, query: ExpenseQuery = {}) =>
    expenses.subscribe(onChange, query);
