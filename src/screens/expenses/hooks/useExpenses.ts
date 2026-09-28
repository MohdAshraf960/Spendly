import {useEffect, useState} from 'react';
import {getExpenses, subscribeToExpenses} from '../../../composition';
import type {Expense, ExpenseQuery} from '../../../domain/entities';

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
      setExpenses(getExpenses(nextQuery));
      setError(undefined);
      return subscribeToExpenses(next => {
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
