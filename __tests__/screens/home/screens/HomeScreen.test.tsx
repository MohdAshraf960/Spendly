import {fireEvent, screen} from '@testing-library/react-native';
import {resetMockRealm} from '../../../../__mock__/realm';
import type {RootStackScreenProps} from '../../../../src/navigation/types';
import {expenseRepository, userRepository} from '../../../../src/repositories';
import HomeScreen from '../../../../src/screens/home/screens/HomeScreen';
import {renderWithTheme} from '../../../test/renderWithTheme';

const navigation = {
  setOptions: jest.fn(),
  navigate: jest.fn(),
  reset: jest.fn(),
} as unknown as RootStackScreenProps<'Home'>['navigation'];

const signIn = () => {
  userRepository.loginWithGoogle({
    googleId: 'google-1',
    email: 'ada@example.com',
    name: 'Ada',
    idToken: 'token-1',
  });
};

describe('HomeScreen', () => {
  beforeEach(() => {
    resetMockRealm();
    jest.mocked(navigation.setOptions).mockClear();
    jest.mocked(navigation.navigate).mockClear();
    jest.mocked(navigation.reset).mockClear();
  });

  it('welcomes the user and shows the empty ledger', async () => {
    signIn();
    await renderWithTheme(
      <HomeScreen
        navigation={navigation}
        route={{key: 'Home', name: 'Home', params: undefined}}
      />,
    );

    expect(screen.getByText('Welcome Ada')).toBeOnTheScreen();
    expect(screen.getByText('No expenses recorded yet')).toBeOnTheScreen();
    expect(screen.getByText('All-Time')).toBeOnTheScreen();
    expect(screen.queryByRole('button', {name: 'Add expense'})).toBeNull();
  });

  it('opens add expense from the empty state', async () => {
    signIn();
    await renderWithTheme(
      <HomeScreen
        navigation={navigation}
        route={{key: 'Home', name: 'Home', params: undefined}}
      />,
    );

    await fireEvent.press(
      screen.getByRole('button', {name: 'Add your first expense'}),
    );

    expect(navigation.navigate).toHaveBeenCalledWith('AddExpense');
  });

  it('lists an expense and opens it for editing', async () => {
    signIn();
    const created = expenseRepository.add({
      title: 'Milk',
      amount: 50,
      category: {
        id: 'food',
        name: 'Food & Dining',
        description: 'Daily',
        imagePath: 'food.webp',
      },
      date: new Date('2026-09-23T10:00:00'),
      note: '',
    });

    await renderWithTheme(
      <HomeScreen
        navigation={navigation}
        route={{key: 'Home', name: 'Home', params: undefined}}
      />,
    );

    expect(screen.getByText('Milk')).toBeOnTheScreen();
    expect(screen.getByText('-₹50')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', {name: 'Expense Milk'}));

    expect(navigation.navigate).toHaveBeenCalledWith('EditExpense', {
      expenseId: created.id,
    });
    expect(screen.getByRole('button', {name: 'Add expense'})).toBeOnTheScreen();
  });
});
