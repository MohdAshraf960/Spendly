import type {RootStackScreenProps} from '../../../navigation/types';
import ExpenseForm from '../components/ExpenseForm';
import {useAddExpense} from '../hooks';

// Shared form in add mode. Header title flips to Income when that category is picked.
const AddExpenseScreen = ({navigation}: RootStackScreenProps<'AddExpense'>) => {
  const {addExpense, saving} = useAddExpense();

  return (
    <ExpenseForm
      mode="add"
      saving={saving}
      onCancel={() => navigation.goBack()}
      onSaved={() => navigation.goBack()}
      onSubmit={values => {
        addExpense(values);
      }}
    />
  );
};

export default AddExpenseScreen;
