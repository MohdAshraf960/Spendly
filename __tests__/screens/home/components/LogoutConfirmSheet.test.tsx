import {fireEvent, screen} from '@testing-library/react-native';
import LogoutConfirmSheet from '../../../../src/screens/home/components/LogoutConfirmSheet';
import {renderWithTheme} from '../../../test/renderWithTheme';

describe('LogoutConfirmSheet', () => {
  it('names the account and confirms logout', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    await renderWithTheme(
      <LogoutConfirmSheet
        visible
        email="ada@example.com"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Log out?')).toBeOnTheScreen();
    expect(screen.getByText(/ada@example.com/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Yes, Log out'));
    await fireEvent.press(screen.getByRole('button', {name: 'Stay signed in'}));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses a generic message when there is no email', async () => {
    await renderWithTheme(
      <LogoutConfirmSheet visible onConfirm={jest.fn()} onClose={jest.fn()} />,
    );

    expect(
      screen.getByText(
        'Are you sure you want to log out? This will clear your offline ledger and signed-in account from this device.',
      ),
    ).toBeOnTheScreen();
  });

  it('hides the sheet when it is not visible', async () => {
    await renderWithTheme(
      <LogoutConfirmSheet
        visible={false}
        onConfirm={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByText('Log out?')).toBeNull();
  });
});
