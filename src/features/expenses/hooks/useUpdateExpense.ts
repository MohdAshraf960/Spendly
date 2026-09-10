import {useCallback, useState} from 'react';
import type {Category} from '../../../shared/data/categories';
import {expenseRepository} from '../data/expenseRepository';
import type {CreateExpenseInput, Expense} from '../data/types';

export type UpdateExpenseInput = Omit<CreateExpenseInput, 'category'> & {
  category: Category;
};

const toStoredCategory = (category: Category) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  imagePath: category.imagePath,
});

// Updates an existing ledger row. Throws if the id is missing.
const useUpdateExpense = () => {
  const [saving, setSaving] = useState(false);

  const updateExpense = useCallback(
    (id: string, input: UpdateExpenseInput): Expense | undefined => {
      setSaving(true);
      try {
        const updated = expenseRepository.update(id, {
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
