import {act, renderHook} from '@testing-library/react-native';
import React, {type ReactNode} from 'react';
import {
  GoogleSignInCancelledError,
  signInWithGoogle,
} from '../../../../src/services';
import {userRepository} from '../../../../src/repositories/userRepository';
import {ThemeProvider} from '../../../../src/shared/context';
import useGoogleSignIn from '../../../../src/screens/auth/hooks/useGoogleSignIn';
import type {GoogleProfile, User} from '../../../../src/types';

jest.mock('../../../../src/services', () => {
  class Cancelled extends Error {
    constructor() {
      super('Google sign-in was cancelled.');
      this.name = 'GoogleSignInCancelledError';
    }
  }

  return {
    signInWithGoogle: jest.fn(),
    GoogleSignInCancelledError: Cancelled,
  };
});

jest.mock('../../../../src/repositories/userRepository', () => ({
  userRepository: {
    getCurrent: jest.fn(),
    loginWithGoogle: jest.fn(),
    updateThemePreference: jest.fn(),
  },
}));

const profile: GoogleProfile = {
  googleId: 'google-1',
  email: 'ada@example.com',
  name: 'Ada',
  idToken: 'token-1',
};

const user: User = {
  id: 'current',
  email: profile.email,
  name: profile.name,
  googleId: profile.googleId,
  idToken: profile.idToken,
  createdAt: new Date('2026-09-23T10:00:00'),
};

const wrapper = ({children}: {children: ReactNode}) =>
  React.createElement(ThemeProvider, null, children);

describe('useGoogleSignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves the Google profile and refreshes the theme', async () => {
    jest.mocked(signInWithGoogle).mockResolvedValue(profile);
    jest.mocked(userRepository.loginWithGoogle).mockReturnValue(user);
    const {result} = await renderHook(() => useGoogleSignIn(), {wrapper});

    let signedIn: User | undefined;
    await act(async () => {
      signedIn = await result.current.signInWithGoogle();
    });

    expect(signedIn).toBe(user);
    expect(userRepository.loginWithGoogle).toHaveBeenCalledWith(profile);
    expect(userRepository.getCurrent).toHaveBeenCalled();
    expect(result.current.signing).toBe(false);
  });

  it('returns undefined when the account picker is cancelled', async () => {
    jest
      .mocked(signInWithGoogle)
      .mockRejectedValue(new GoogleSignInCancelledError());
    const {result} = await renderHook(() => useGoogleSignIn(), {wrapper});

    let signedIn: User | undefined;
    await act(async () => {
      signedIn = await result.current.signInWithGoogle();
    });

    expect(signedIn).toBeUndefined();
    expect(userRepository.loginWithGoogle).not.toHaveBeenCalled();
    expect(result.current.signing).toBe(false);
  });

  it('rethrows unexpected sign-in failures', async () => {
    const failure = new Error('network');
    jest.mocked(signInWithGoogle).mockRejectedValue(failure);
    const {result} = await renderHook(() => useGoogleSignIn(), {wrapper});

    await expect(
      act(async () => {
        await result.current.signInWithGoogle();
      }),
    ).rejects.toBe(failure);
    expect(userRepository.loginWithGoogle).not.toHaveBeenCalled();
    expect(result.current.signing).toBe(false);
  });
});
