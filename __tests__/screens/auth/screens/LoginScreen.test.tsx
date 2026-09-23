import {fireEvent, screen} from '@testing-library/react-native';
import type {RootStackScreenProps} from '../../../../src/navigation/types';
import LoginScreen from '../../../../src/screens/auth/screens/LoginScreen';
import useGoogleSignIn from '../../../../src/screens/auth/hooks/useGoogleSignIn';
import type {User} from '../../../../src/types';
import {renderWithTheme} from '../../../test/renderWithTheme';

jest.mock('../../../../src/screens/auth/hooks/useGoogleSignIn', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const user: User = {
  id: 'current',
  email: 'ada@example.com',
  createdAt: new Date('2026-09-23T10:00:00'),
};

const renderLogin = async (
  hook: {signInWithGoogle: jest.Mock; signing: boolean},
) => {
  jest.mocked(useGoogleSignIn).mockReturnValue(hook);
  const navigation = {
    replace: jest.fn(),
  } as unknown as RootStackScreenProps<'Login'>['navigation'];

  await renderWithTheme(
    <LoginScreen
      navigation={navigation}
      route={{key: 'Login', name: 'Login', params: undefined}}
    />,
  );

  return {navigation};
};

describe('LoginScreen', () => {
  const signInWithGoogle = jest.fn();

  beforeEach(() => {
    signInWithGoogle.mockReset();
  });

  it('shows the Google sign-in prompt', async () => {
    await renderLogin({signInWithGoogle, signing: false});

    expect(screen.getByText('Track your money. Simply.')).toBeOnTheScreen();
    expect(
      screen.getByRole('button', {name: 'Continue with Google'}),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Spendly')).toBeOnTheScreen();
  });

  it('opens Home after a successful sign-in', async () => {
    signInWithGoogle.mockResolvedValue(user);
    const {navigation} = await renderLogin({signInWithGoogle, signing: false});

    await fireEvent.press(
      screen.getByRole('button', {name: 'Continue with Google'}),
    );

    expect(navigation.replace).toHaveBeenCalledWith('Home');
  });

  it('stays on Login when sign-in is cancelled', async () => {
    signInWithGoogle.mockResolvedValue(undefined);
    const {navigation} = await renderLogin({signInWithGoogle, signing: false});

    await fireEvent.press(
      screen.getByRole('button', {name: 'Continue with Google'}),
    );

    expect(navigation.replace).not.toHaveBeenCalled();
    expect(screen.queryByText('Couldn’t sign in')).toBeNull();
  });

  it('shows the error message and dismisses it', async () => {
    signInWithGoogle.mockRejectedValue(new Error('Play services missing'));
    await renderLogin({signInWithGoogle, signing: false});

    await fireEvent.press(
      screen.getByRole('button', {name: 'Continue with Google'}),
    );

    expect(screen.getByText('Couldn’t sign in')).toBeOnTheScreen();
    expect(screen.getByText('Play services missing')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', {name: 'Try Again'}));

    expect(screen.queryByText('Couldn’t sign in')).toBeNull();
  });

  it('shows a fallback message for a non-Error failure', async () => {
    signInWithGoogle.mockRejectedValue('offline');
    await renderLogin({signInWithGoogle, signing: false});

    await fireEvent.press(
      screen.getByRole('button', {name: 'Continue with Google'}),
    );

    expect(
      screen.getByText(
        'Something went wrong while signing in with Google. Please try again.',
      ),
    ).toBeOnTheScreen();
  });

  it('disables the button while signing', async () => {
    await renderLogin({signInWithGoogle, signing: true});

    expect(
      screen.getByRole('button', {name: 'Continue with Google'}),
    ).toBeDisabled();
    expect(screen.queryByText('Continue with Google')).toBeNull();
  });
});
