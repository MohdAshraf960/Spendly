import {fireEvent, screen} from '@testing-library/react-native';
import ExpenseListItem from '../../../../src/screens/home/components/ExpenseListItem';
import type {Expense} from '../../../../src/types';
import {renderWithTheme} from '../../../test/renderWithTheme';

const expense = (categoryId: string): Expense => ({
  id: 'expense-1',
  title: 'Milk',
  amount: 50,
  category: {
    id: categoryId,
    name: categoryId === 'income' ? 'Income' : 'Food & Dining',
    description: 'Daily',
    imagePath: 'food.webp',
  },
  date: new Date('2026-09-23T10:00:00'),
  note: '',
  createdAt: new Date('2026-09-23T10:00:00'),
});

describe('ExpenseListItem', () => {
  it('shows a spend as a negative amount and handles presses', async () => {
    const onPress = jest.fn();
    const onDeletePress = jest.fn();
    await renderWithTheme(
      <ExpenseListItem
        expense={expense('food')}
        onPress={onPress}
        onDeletePress={onDeletePress}
      />,
    );

    expect(screen.getByText('-₹50')).toBeOnTheScreen();
    await fireEvent.press(
      screen.getByRole('button', {name: 'Expense Milk'}),
    );
    await fireEvent.press(screen.getByRole('button', {name: 'Delete Milk'}));

    expect(onPress).toHaveBeenCalled();
    expect(onDeletePress).toHaveBeenCalled();
  });

  it('shows income as a positive amount', async () => {
    await renderWithTheme(
      <ExpenseListItem
        expense={expense('income')}
        onPress={jest.fn()}
        onDeletePress={jest.fn()}
      />,
    );

    expect(screen.getByText('+₹50')).toBeOnTheScreen();
    expect(screen.getByRole('button', {name: 'Income Milk'})).toBeOnTheScreen();
  });
});
