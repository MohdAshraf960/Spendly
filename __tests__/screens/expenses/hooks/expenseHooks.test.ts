import {act, renderHook} from '@testing-library/react-native';
import {resetMockRealm} from '../../../../__mock__/realm';
import {expenseRepository} from '../../../../src/repositories';
import useAddExpense from '../../../../src/screens/expenses/hooks/useAddExpense';
import useDeleteExpense from '../../../../src/screens/expenses/hooks/useDeleteExpense';
import useExpense from '../../../../src/screens/expenses/hooks/useExpense';
import useExpenses from '../../../../src/screens/expenses/hooks/useExpenses';
import useUpdateExpense from '../../../../src/screens/expenses/hooks/useUpdateExpense';
import {CATEGORIES} from '../../../../src/shared/data/categories';

const food = CATEGORIES.find(category => category.id === 'food')!;

const input = {
  title: ' Milk ',
  amount: 42,
  category: food,
  date: new Date('2026-09-23T10:00:00'),
  note: ' store ',
};

describe('expense screen hooks', () => {
  beforeEach(() => {
    resetMockRealm();
  });

  it('adds an expense without the category image', async () => {
    const {result} = await renderHook(() => useAddExpense());

    let createdId = '';
    await act(async () => {
      createdId = result.current.addExpense(input).id;
    });

    expect(expenseRepository.getById(createdId)?.category).toEqual({
      id: food.id,
      name: food.name,
      description: food.description,
      imagePath: food.imagePath,
    });
    expect(result.current.saving).toBe(false);
  });

  it('lists, loads, updates, and deletes an expense', async () => {
    const {result: addResult} = await renderHook(() => useAddExpense());
    let createdId = '';
    await act(async () => {
      createdId = addResult.current.addExpense(input).id;
    });

    const {result: listResult} = await renderHook(() =>
      useExpenses({search: 'milk'}),
    );
    expect(listResult.current.loading).toBe(false);
    expect(listResult.current.error).toBeUndefined();
    expect(listResult.current.expenses.map(item => item.id)).toEqual([
      createdId,
    ]);

    const {result: oneResult} = await renderHook(() => useExpense(createdId));
    expect(oneResult.current?.title).toBe(' Milk ');

    const {result: missingResult} = await renderHook(() => useExpense());
    expect(missingResult.current).toBeUndefined();

    const {result: updateResult} = await renderHook(() => useUpdateExpense());
    await act(async () => {
      updateResult.current.updateExpense(createdId, {
        ...input,
        title: 'Tea',
        amount: 15,
      });
    });
    expect(expenseRepository.getById(createdId)?.title).toBe('Tea');
    expect(updateResult.current.saving).toBe(false);

    const {result: deleteResult} = await renderHook(() => useDeleteExpense());
    await act(async () => {
      deleteResult.current.deleteExpense(createdId);
    });
    expect(expenseRepository.getById(createdId)).toBeUndefined();

    let thrown: unknown;
    await act(async () => {
      try {
        updateResult.current.updateExpense('missing', input);
      } catch (error) {
        thrown = error;
      }
    });
    expect((thrown as Error).message).toBe(
      'This expense could not be updated. Please try again.',
    );
  });
});
