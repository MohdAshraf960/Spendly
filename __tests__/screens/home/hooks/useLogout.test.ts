import {act, renderHook} from '@testing-library/react-native';
import React, {type ReactNode} from 'react';
import {resetMockRealm} from '../../../../__mock__/realm';
import {userRepository} from '../../../../src/repositories';
import useLogout from '../../../../src/screens/home/hooks/useLogout';
import {ThemeProvider} from '../../../../src/shared/context';

const wrapper = ({children}: {children: ReactNode}) =>
  React.createElement(ThemeProvider, null, children);

describe('useLogout', () => {
  beforeEach(() => {
    resetMockRealm();
  });

  it('signs out and clears the local session', async () => {
    userRepository.loginWithGoogle({
      googleId: 'google-1',
      email: 'ada@example.com',
      name: 'Ada',
      idToken: 'token-1',
    });
    userRepository.updateThemePreference('dark');
    const {result} = await renderHook(() => useLogout(), {wrapper});

    await act(async () => {
      await result.current.logout();
    });

    expect(userRepository.getCurrent()).toBeUndefined();
    expect(result.current.loggingOut).toBe(false);
  });
});
