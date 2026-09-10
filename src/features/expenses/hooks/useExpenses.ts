import {useEffect, useState} from 'react';
import {expenseRepository} from '../data/expenseRepository';
import type {Expense} from '../data/types';

// Live list, newest first. Realm listener keeps Home in sync after writes.
const toErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : 'Something went wrong while loading transactions. Please try again.';

const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    try {
      setExpenses(expenseRepository.getAllLatestFirst());
      return expenseRepository.subscribe(next => {
        try {
          setExpenses(next);
          setError(undefined);
        } catch (caught) {
          setError(toErrorMessage(caught));
        }
      });
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  return {expenses, loading, error};
};

export default useExpenses;
