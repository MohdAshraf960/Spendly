import {act, screen} from '@testing-library/react-native';
import {resetMockRealm} from '../../../../__mock__/realm';
import type {RootStackScreenProps} from '../../../../src/navigation/types';
import {userRepository} from '../../../../src/repositories';
import SplashScreen from '../../../../src/screens/splash/screens/SplashScreen';
import {renderWithTheme} from '../../../test/renderWithTheme';

const navigation = {
  replace: jest.fn(),
} as unknown as RootStackScreenProps<'Splash'>['navigation'];

describe('SplashScreen', () => {
  beforeEach(() => {
    resetMockRealm();
    navigation.replace.mockReset();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the brand and opens Login when there is no session', async () => {
    await renderWithTheme(
      <SplashScreen
        navigation={navigation}
        route={{key: 'Splash', name: 'Splash', params: undefined}}
      />,
    );

    expect(screen.getByText('Spendly')).toBeOnTheScreen();
    expect(screen.getByLabelText('Spendly')).toBeOnTheScreen();

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    expect(navigation.replace).toHaveBeenCalledWith('Login');
  });

  it('opens Home when a session already exists', async () => {
    userRepository.loginWithGoogle({
      googleId: 'google-1',
      email: 'ada@example.com',
      name: 'Ada',
      idToken: 'token-1',
    });

    await renderWithTheme(
      <SplashScreen
        navigation={navigation}
        route={{key: 'Splash', name: 'Splash', params: undefined}}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(1600);
    });

    expect(navigation.replace).toHaveBeenCalledWith('Home');
  });
});
