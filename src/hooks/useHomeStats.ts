import {useEffect, useState} from 'react';
import {expenseRepository} from '../repositories/expenseRepository';
import {isIncomeCategory} from '../shared/data/categories';
import type {Expense} from '../types/expense';
import type {HomeStats} from '../types/home';

// Spent totals exclude Income. Transaction count still includes every row.
const isSpending = (expense: Expense) => !isIncomeCategory(expense.category);

const sumAmounts = (items: Expense[]) =>
  items.reduce((sum, expense) => sum + expense.amount, 0);

export const getHomeStats = (expenses: Expense[]): HomeStats => {
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

// Overview cards always use the full ledger, not the active search query.
export const useLedgerStats = () => {
  const [stats, setStats] = useState<HomeStats>(() => getHomeStats([]));

  useEffect(() => {
    const apply = (items: Expense[]) => setStats(getHomeStats(items));
    apply(expenseRepository.getAllLatestFirst());
    return expenseRepository.subscribe(apply);
  }, []);

  return stats;
};
