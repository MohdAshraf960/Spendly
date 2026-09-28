import {useCallback, useState} from 'react';
import {addExpense as saveExpense} from '../../../composition';
import type {Expense} from '../../../domain/entities';
import type {Category} from '../../../shared/data/categories';

export type AddExpenseInput = {
  title: string;
  amount: number;
  category: Category;
  date: Date;
  note: string;
};

const toStoredCategory = (category: Category) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  imagePath: category.imagePath,
});

const useAddExpense = () => {
  const [saving, setSaving] = useState(false);

  const addExpense = useCallback((input: AddExpenseInput): Expense => {
    setSaving(true);
    try {
      return saveExpense({
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
