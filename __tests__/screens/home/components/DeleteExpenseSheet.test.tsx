import {fireEvent, screen} from '@testing-library/react-native';
import DeleteExpenseSheet from '../../../../src/screens/home/components/DeleteExpenseSheet';
import type {Expense} from '../../../../src/types';
import {renderWithTheme} from '../../../test/renderWithTheme';

const expense: Expense = {
  id: 'expense-1',
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
  createdAt: new Date('2026-09-23T10:00:00'),
};

describe('DeleteExpenseSheet', () => {
  it('renders nothing without an expense', async () => {
    await renderWithTheme(
      <DeleteExpenseSheet
        visible
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText('Delete Expense?')).toBeNull();
  });

  it('confirms or keeps the expense', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await renderWithTheme(
      <DeleteExpenseSheet
        expense={expense}
        visible
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Delete Expense?')).toBeOnTheScreen();
    expect(screen.getByText(/Milk/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Yes, Delete Expense'));
    await fireEvent.press(screen.getByRole('button', {name: 'Keep expense'}));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the sheet when it is not visible', async () => {
    await renderWithTheme(
      <DeleteExpenseSheet
        expense={expense}
        visible={false}
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText('Delete Expense?')).toBeNull();
  });
});
