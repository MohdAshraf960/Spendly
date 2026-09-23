import {screen} from '@testing-library/react-native';
import type {RootStackScreenProps} from '../../../../src/navigation/types';
import EditExpenseScreen from '../../../../src/screens/expenses/screens/EditExpenseScreen';
import useExpense from '../../../../src/screens/expenses/hooks/useExpense';
import useUpdateExpense from '../../../../src/screens/expenses/hooks/useUpdateExpense';
import {renderWithTheme} from '../../../test/renderWithTheme';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({setOptions: jest.fn()}),
}));

jest.mock('../../../../src/screens/expenses/hooks/useExpense', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../src/screens/expenses/hooks/useUpdateExpense', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const navigation = {
  goBack: jest.fn(),
} as unknown as RootStackScreenProps<'EditExpense'>['navigation'];

const route = {
  key: 'EditExpense',
  name: 'EditExpense' as const,
  params: {expenseId: 'expense-1'},
};

describe('EditExpenseScreen', () => {
  beforeEach(() => {
    navigation.goBack.mockReset();
    jest.mocked(useUpdateExpense).mockReturnValue({
      updateExpense: jest.fn(),
      saving: false,
    });
  });

  it('goes back when the expense no longer exists', async () => {
    jest.mocked(useExpense).mockReturnValue(undefined);

    await renderWithTheme(
      <EditExpenseScreen navigation={navigation} route={route} />,
    );

    expect(navigation.goBack).toHaveBeenCalled();
    expect(screen.queryByPlaceholderText('Expense title')).toBeNull();
  });

  it('fills the form from the stored expense', async () => {
    jest.mocked(useExpense).mockReturnValue({
      id: 'expense-1',
      title: 'Milk',
      amount: 42,
      category: {
        id: 'food',
        name: 'Food & Dining',
        description: 'Restaurants',
        imagePath: 'assets/categories/food_and_drink.webp',
      },
      date: new Date('2026-09-23T10:00:00'),
      note: 'store',
      createdAt: new Date('2026-09-23T10:00:00'),
    });

    await renderWithTheme(
      <EditExpenseScreen navigation={navigation} route={route} />,
    );

    expect(screen.getByDisplayValue('Milk')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('42')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('store')).toBeOnTheScreen();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });
});
