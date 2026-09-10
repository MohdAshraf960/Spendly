import {useCallback} from 'react';
import {expenseRepository} from '../data/expenseRepository';

// Home confirm sheet calls this after the user accepts delete.
export const useDeleteExpense = () => {
  const deleteExpense = useCallback((id: string) => {
    expenseRepository.delete(id);
  }, []);

  return {deleteExpense};
};

export default useDeleteExpense;
