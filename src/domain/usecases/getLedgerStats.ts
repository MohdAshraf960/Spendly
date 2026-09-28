import {isIncomeCategory} from '../entities/category';
import type {Expense} from '../entities/expense';
import type {HomeStats} from '../entities/homeStats';

const isSpending = (expense: Expense) => !isIncomeCategory(expense.category);

const sumAmounts = (items: Expense[]) =>
  items.reduce((sum, expense) => sum + expense.amount, 0);

// Spent totals exclude Income. Transaction count still includes every row.
export const getLedgerStats = (expenses: Expense[]): HomeStats => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const spending = expenses.filter(isSpending);
  const thisMonthSpending = spending.filter(
    expense =>
      expense.date.getMonth() === month && expense.date.getFullYear() === year,
  );

  return {
    allTimeTotal: sumAmounts(spending),
    thisMonthTotal: sumAmounts(thisMonthSpending),
    transactionCount: expenses.length,
  };
};
