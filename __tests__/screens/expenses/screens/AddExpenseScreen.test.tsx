import {fireEvent, screen} from '@testing-library/react-native';
import type {RootStackScreenProps} from '../../../../src/navigation/types';
import AddExpenseScreen from '../../../../src/screens/expenses/screens/AddExpenseScreen';
import useAddExpense from '../../../../src/screens/expenses/hooks/useAddExpense';
import {CATEGORIES} from '../../../../src/shared/data/categories';
import {renderWithTheme} from '../../../test/renderWithTheme';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({setOptions: jest.fn()}),
}));

jest.mock('../../../../src/screens/expenses/hooks/useAddExpense', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const food = CATEGORIES.find(category => category.id === 'food')!;

describe('AddExpenseScreen', () => {
  const addExpense = jest.fn();
  const navigation = {
    goBack: jest.fn(),
  } as unknown as RootStackScreenProps<'AddExpense'>['navigation'];

  beforeEach(() => {
    addExpense.mockReset();
    navigation.goBack.mockReset();
    jest.mocked(useAddExpense).mockReturnValue({addExpense, saving: false});
  });

  it('saves the form and goes back after the success dialog', async () => {
    await renderWithTheme(
      <AddExpenseScreen
        navigation={navigation}
        route={{key: 'AddExpense', name: 'AddExpense', params: undefined}}
      />,
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('Expense title'),
      'Milk',
    );
    await fireEvent.changeText(screen.getByPlaceholderText('0.00'), '42');
    await fireEvent.press(screen.getByRole('button', {name: 'Select category'}));
    await fireEvent.press(screen.getByRole('radio', {name: food.name}));
    await fireEvent.press(screen.getByRole('button', {name: 'Save Changes'}));
    await fireEvent.press(screen.getByRole('button', {name: 'OK'}));

    expect(addExpense).toHaveBeenCalledWith(
      expect.objectContaining({title: 'Milk', amount: 42, category: food}),
    );
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('goes back from Cancel', async () => {
    await renderWithTheme(
      <AddExpenseScreen
        navigation={navigation}
        route={{key: 'AddExpense', name: 'AddExpense', params: undefined}}
      />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Cancel'}));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });
});
