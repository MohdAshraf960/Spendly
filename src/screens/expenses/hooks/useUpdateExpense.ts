import {useCallback, useState} from 'react';
import {updateExpense as saveExpense} from '../../../composition';
import type {Expense} from '../../../domain/entities';
import type {Category} from '../../../shared/data/categories';

export type UpdateExpenseInput = {
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

const useUpdateExpense = () => {
  const [saving, setSaving] = useState(false);

  const updateExpense = useCallback(
    (id: string, input: UpdateExpenseInput): Expense | undefined => {
      setSaving(true);
      try {
        const updated = saveExpense(id, {
          title: input.title,
          amount: input.amount,
          date: input.date,
          note: input.note,
          category: toStoredCategory(input.category),
        });

        if (!updated) {
          throw new Error('This expense could not be updated. Please try again.');
        }

        return updated;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {updateExpense, saving};
};

export default useUpdateExpense;
