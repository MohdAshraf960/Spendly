import {useEffect, useState} from 'react';
import {expenseRepository} from '../data/expenseRepository';
import type {Expense, ExpenseQuery} from '../data/types';

// Live Realm query for Home. Search and filters run in the database.
const toErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : 'Something went wrong while loading transactions. Please try again.';

const useExpenses = (query: ExpenseQuery = {}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const categoryKey = query.categoryIds?.join(',') ?? '';
  const fromKey = query.fromDate?.getTime() ?? 0;
  const endKey = query.endDate?.getTime() ?? 0;

  useEffect(() => {
    const nextQuery: ExpenseQuery = {
      search: query.search,
      categoryIds: query.categoryIds,
      fromDate: query.fromDate,
      endDate: query.endDate,
    };

    setLoading(true);
    try {
      setExpenses(expenseRepository.getLatestFirst(nextQuery));
      setError(undefined);
      return expenseRepository.subscribe(next => {
        try {
          setExpenses(next);
          setError(undefined);
        } catch (caught) {
          setError(toErrorMessage(caught));
        }
      }, nextQuery);
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [query.search, categoryKey, fromKey, endKey]);

  return {expenses, loading, error};
};

export default useExpenses;
