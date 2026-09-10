import {useCallback, useState} from 'react';
import type {Category} from '../../../shared/data/categories';
import {expenseRepository} from '../data/expenseRepository';
import type {CreateExpenseInput, Expense} from '../data/types';

export type AddExpenseInput = Omit<CreateExpenseInput, 'category'> & {
  category: Category;
};

const toStoredCategory = (category: Category) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  imagePath: category.imagePath,
});

// Maps the form category (with image) to the stored category fields.
const useAddExpense = () => {
  const [saving, setSaving] = useState(false);

  const addExpense = useCallback((input: AddExpenseInput): Expense => {
    setSaving(true);
    try {
      return expenseRepository.add({
        title: input.title,
        amount: input.amount,
        date: input.date,
        note: input.note,
        category: toStoredCategory(input.category),
      });
    } finally {
      setSaving(false);
    }
  }, []);

  return {addExpense, saving};
};

export default useAddExpense;
