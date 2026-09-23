import {act, fireEvent, screen} from '@testing-library/react-native';
import ExpenseForm from '../../../../src/screens/expenses/components/ExpenseForm';
import {CATEGORIES} from '../../../../src/shared/data/categories';
import {renderWithTheme} from '../../../test/renderWithTheme';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({setOptions: jest.fn()}),
}));

const food = CATEGORIES.find(category => category.id === 'food')!;

describe('ExpenseForm', () => {
  it('shows a validation dialog when required fields are empty', async () => {
    const onSubmit = jest.fn();
    await renderWithTheme(
      <ExpenseForm onCancel={jest.fn()} onSaved={jest.fn()} onSubmit={onSubmit} />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Save Changes'}));

    expect(screen.getByText('Couldn’t save expense')).toBeOnTheScreen();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps only a valid amount', async () => {
    await renderWithTheme(
      <ExpenseForm onCancel={jest.fn()} onSaved={jest.fn()} onSubmit={jest.fn()} />,
    );

    await fireEvent.changeText(screen.getByPlaceholderText('0.00'), '12a.349');

    expect(screen.getByDisplayValue('12.34')).toBeOnTheScreen();
  });

  it('saves a trimmed expense and leaves after OK', async () => {
    const onSubmit = jest.fn();
    const onSaved = jest.fn();
    await renderWithTheme(
      <ExpenseForm onCancel={jest.fn()} onSaved={onSaved} onSubmit={onSubmit} />,
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('Expense title'),
      '  Milk  ',
    );
    await fireEvent.changeText(screen.getByPlaceholderText('0.00'), '42');
    await fireEvent.press(screen.getByRole('button', {name: 'Select category'}));
    await fireEvent.press(screen.getByRole('radio', {name: food.name}));
    await fireEvent.press(screen.getByRole('button', {name: 'Save Changes'}));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Milk',
        amount: 42,
        category: food,
        note: '',
      }),
    );
    expect(screen.getByText('Expense saved')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', {name: 'OK'}));

    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel from the cancel button', async () => {
    const onCancel = jest.fn();
    await renderWithTheme(
      <ExpenseForm onCancel={onCancel} onSaved={jest.fn()} onSubmit={jest.fn()} />,
    );

    await fireEvent.press(screen.getByRole('button', {name: 'Cancel'}));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('reports a thrown save error', async () => {
    await renderWithTheme(
      <ExpenseForm
        initialTitle="Milk"
        initialAmount="42"
        initialCategory={food}
        onCancel={jest.fn()}
        onSaved={jest.fn()}
        onSubmit={() => {
          throw new Error('Disk full');
        }}
      />,
    );

    await act(async () => {
      await fireEvent.press(screen.getByRole('button', {name: 'Save Changes'}));
    });

    expect(screen.getByText('Disk full')).toBeOnTheScreen();
  });
});
