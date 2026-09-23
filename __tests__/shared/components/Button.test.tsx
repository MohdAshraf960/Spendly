import {fireEvent, screen} from '@testing-library/react-native';
import Button from '../../../src/shared/components/Button';
import {renderWithTheme} from '../../test/renderWithTheme';

describe('Button', () => {
  it('exposes a button role with its title', async () => {
    await renderWithTheme(<Button title="Save expense" />);

    expect(
      screen.getByRole('button', {name: 'Save expense'}),
    ).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Button title="Add" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', {name: 'Add'}));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <Button title="Delete" disabled onPress={onPress} />,
    );

    const button = screen.getByRole('button', {name: 'Delete'});
    expect(button).toBeDisabled();

    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
  });
});
