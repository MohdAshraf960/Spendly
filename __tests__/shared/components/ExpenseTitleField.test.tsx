import {fireEvent, screen} from '@testing-library/react-native';
import ExpenseTitleField from '../../../src/shared/components/ExpenseTitleField';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('ExpenseTitleField', () => {
  it('shows the default title field', async () => {
    await renderWithTheme(
      <ExpenseTitleField value="" onChangeText={jest.fn()} />,
    );

    expect(screen.getByText(/Expense Title/)).toBeOnTheScreen();
    expect(screen.getByText('REQUIRED')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Expense title')).toBeOnTheScreen();
  });

  it('calls onChangeText', async () => {
    const onChangeText = jest.fn();
    await renderWithTheme(
      <ExpenseTitleField value="" onChangeText={onChangeText} />,
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('Expense title'),
      'Milk',
    );

    expect(onChangeText).toHaveBeenCalledWith('Milk');
  });

  it('shows a prefix and a custom label', async () => {
    await renderWithTheme(
      <ExpenseTitleField
        value="42"
        onChangeText={jest.fn()}
        label="Amount"
        hint="INR"
        prefix="Rs"
        placeholder="0"
      />,
    );

    expect(screen.getByText(/Amount/)).toBeOnTheScreen();
    expect(screen.getByText('Rs')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('42')).toBeOnTheScreen();
  });

  it('shows a validation error', async () => {
    await renderWithTheme(
      <ExpenseTitleField
        value=""
        onChangeText={jest.fn()}
        error="Expense title is required"
      />,
    );

    expect(screen.getByText('Expense title is required')).toBeOnTheScreen();
  });
});
