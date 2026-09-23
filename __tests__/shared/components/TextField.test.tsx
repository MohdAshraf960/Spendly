import {fireEvent, screen} from '@testing-library/react-native';
import {Text} from 'react-native';
import TextField from '../../../src/shared/components/TextField';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('TextField', () => {
  it('shows the label and placeholder', async () => {
    await renderWithTheme(
      <TextField label="Search" placeholder="Find an expense" />,
    );

    expect(screen.getByText('Search')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Find an expense')).toBeOnTheScreen();
  });

  it('calls onChangeText when the value changes', async () => {
    const onChangeText = jest.fn();
    await renderWithTheme(
      <TextField placeholder="Title" onChangeText={onChangeText} />,
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('Title'),
      'Groceries',
    );

    expect(onChangeText).toHaveBeenCalledWith('Groceries');
  });

  it('shows an error message', async () => {
    await renderWithTheme(
      <TextField placeholder="Title" error="Expense title is required" />,
    );

    expect(screen.getByText('Expense title is required')).toBeOnTheScreen();
  });

  it('renders prefix and suffix', async () => {
    await renderWithTheme(
      <TextField
        placeholder="Amount"
        prefix={<Text>₹</Text>}
        suffix={<Text>INR</Text>}
      />,
    );

    expect(screen.getByText('₹')).toBeOnTheScreen();
    expect(screen.getByText('INR')).toBeOnTheScreen();
  });

  it('is not editable when disabled', async () => {
    await renderWithTheme(
      <TextField placeholder="Title" disabled value="Locked" />,
    );

    expect(screen.getByDisplayValue('Locked')).toBeDisabled();
  });

  it('forwards focus and blur', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    await renderWithTheme(
      <TextField placeholder="Title" onFocus={onFocus} onBlur={onBlur} />,
    );

    const input = screen.getByPlaceholderText('Title');
    await fireEvent(input, 'focus');
    await fireEvent(input, 'blur');

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
