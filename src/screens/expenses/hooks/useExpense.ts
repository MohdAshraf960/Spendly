import {useMemo} from 'react';
import {expenseRepository} from '../../../repositories/expenseRepository';

// Loads one expense for the edit screen. Missing id returns undefined.
const useExpense = (id?: string) =>
  useMemo(() => (id ? expenseRepository.getById(id) : undefined), [id]);

export default useExpense;
