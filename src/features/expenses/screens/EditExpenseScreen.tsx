import {useEffect} from 'react';
import type {RootStackScreenProps} from '../../../app/navigation/types';
import {toCategory} from '../../../shared/data/categories';
import ExpenseForm from '../components/ExpenseForm';
import {useExpense, useUpdateExpense} from '../hooks';

const EditExpenseScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'EditExpense'>) => {
  // Leave if the row was deleted while this screen was opening.
  const expense = useExpense(route.params.expenseId);
  const {updateExpense, saving} = useUpdateExpense();

  useEffect(() => {
    if (!expense) {
      navigation.goBack();
    }
  }, [expense, navigation]);

  if (!expense) {
    return null;
  }

  return (
    <ExpenseForm
      mode="edit"
      initialTitle={expense.title}
      initialAmount={String(expense.amount)}
      initialCategory={toCategory(expense.category)}
      initialDate={expense.date}
      initialNote={expense.note}
      saving={saving}
      onCancel={() => navigation.goBack()}
      onSaved={() => navigation.goBack()}
      onSubmit={values => {
        updateExpense(expense.id, values);
      }}
    />
  );
};

export default EditExpenseScreen;
