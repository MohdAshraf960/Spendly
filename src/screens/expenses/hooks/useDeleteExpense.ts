import {useCallback} from 'react';
import {deleteExpense as removeExpense} from '../../../composition';

export const useDeleteExpense = () => {
  const deleteExpense = useCallback((id: string) => {
    removeExpense(id);
  }, []);

  return {deleteExpense};
};

export default useDeleteExpense;
