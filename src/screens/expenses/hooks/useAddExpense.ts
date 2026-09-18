import {useCallback, useState} from 'react';
import {expenseRepository} from '../../../repositories/expenseRepository';
import type {Expense, CreateExpenseInput} from '../../../types/expense';
import type {Category} from '../../../shared/data/categories';


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
