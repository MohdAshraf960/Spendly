import {renderHook} from '@testing-library/react-native';
import {resetMockRealm} from '../../../../__mock__/realm';
import {userRepository} from '../../../../src/repositories';
import useCurrentUser from '../../../../src/screens/home/hooks/useCurrentUser';

describe('useCurrentUser', () => {
  beforeEach(() => {
    resetMockRealm();
  });

  it('returns the signed-in user', async () => {
    userRepository.loginWithGoogle({
      googleId: 'google-1',
      email: 'ada@example.com',
      name: 'Ada',
      idToken: 'token-1',
    });

    const {result} = await renderHook(() => useCurrentUser());

    expect(result.current).toMatchObject({
      email: 'ada@example.com',
      name: 'Ada',
    });
  });

  it('returns undefined when nobody is signed in', async () => {
    const {result} = await renderHook(() => useCurrentUser());

    expect(result.current).toBeUndefined();
  });
});
