import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GoogleSignInCancelledError,
  refreshGoogleSession,
  signInWithGoogle,
  signOutFromGoogle,
} from '../../src/services';

const successUser = {
  id: 'google-1',
  email: 'ada@example.com',
  name: 'Ada',
  photo: 'https://example.com/ada.png',
};

describe('googleAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signs in and maps the Google profile', async () => {
    jest.mocked(GoogleSignin.signIn).mockResolvedValue({
      type: 'success',
      data: {idToken: 'token-1', user: successUser},
    } as never);

    await expect(signInWithGoogle()).resolves.toEqual({
      googleId: 'google-1',
      email: 'ada@example.com',
      name: 'Ada',
      photo: 'https://example.com/ada.png',
      idToken: 'token-1',
    });
    expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith({
      showPlayServicesUpdateDialog: true,
    });
    expect(GoogleSignin.configure).toHaveBeenCalledWith({
      webClientId: expect.any(String),
      offlineAccess: true,
    });
    expect(
      jest.mocked(GoogleSignin.configure).mock.calls[0][0].webClientId,
    ).not.toBe('');
  });

  it('treats a dismissed account picker as a cancel', async () => {
    jest.mocked(GoogleSignin.signIn).mockResolvedValue({type: 'cancelled'} as never);

    await expect(signInWithGoogle()).rejects.toBeInstanceOf(
      GoogleSignInCancelledError,
    );
  });

  it('maps a cancelled status code to GoogleSignInCancelledError', async () => {
    jest.mocked(GoogleSignin.signIn).mockRejectedValue({
      code: statusCodes.SIGN_IN_CANCELLED,
    });

    await expect(signInWithGoogle()).rejects.toBeInstanceOf(
      GoogleSignInCancelledError,
    );
  });

  it('rethrows unexpected sign-in errors', async () => {
    const failure = new Error('network');
    jest.mocked(GoogleSignin.signIn).mockRejectedValue(failure);

    await expect(signInWithGoogle()).rejects.toBe(failure);
  });

  it('returns undefined when there is no saved Google session', async () => {
    jest.mocked(GoogleSignin.signInSilently).mockResolvedValue({
      type: 'noSavedCredentialFound',
    } as never);

    await expect(refreshGoogleSession()).resolves.toBeUndefined();
  });

  it('refreshes the ID token for a saved session', async () => {
    jest.mocked(GoogleSignin.signInSilently).mockResolvedValue({
      type: 'success',
      data: {idToken: 'stale', user: successUser},
    } as never);
    jest.mocked(GoogleSignin.getTokens).mockResolvedValue({idToken: 'fresh'} as never);

    await expect(refreshGoogleSession()).resolves.toMatchObject({
      email: 'ada@example.com',
      idToken: 'fresh',
    });
  });

  it('keeps the silent-sign-in token when getTokens fails', async () => {
    jest.mocked(GoogleSignin.signInSilently).mockResolvedValue({
      type: 'success',
      data: {idToken: 'stale', user: {...successUser, name: null, photo: null}},
    } as never);
    jest.mocked(GoogleSignin.getTokens).mockRejectedValue(new Error('no token'));

    await expect(refreshGoogleSession()).resolves.toEqual({
      googleId: 'google-1',
      email: 'ada@example.com',
      name: undefined,
      photo: undefined,
      idToken: 'stale',
    });
  });

  it('returns undefined when silent sign-in throws', async () => {
    jest.mocked(GoogleSignin.signInSilently).mockRejectedValue(new Error('revoked'));

    await expect(refreshGoogleSession()).resolves.toBeUndefined();
  });

  it('revokes access and signs out, even if revoke fails', async () => {
    jest.mocked(GoogleSignin.revokeAccess).mockRejectedValueOnce(new Error('offline'));

    await signOutFromGoogle();

    expect(GoogleSignin.revokeAccess).toHaveBeenCalledTimes(1);
    expect(GoogleSignin.signOut).toHaveBeenCalledTimes(1);
  });

  it('configures the SDK only once', async () => {
    let signOut: () => Promise<void> = async () => undefined;
    let configure = GoogleSignin.configure;

    jest.isolateModules(() => {
      signOut = require('../../src/services/googleAuth').signOutFromGoogle;
      configure =
        require('@react-native-google-signin/google-signin').GoogleSignin
          .configure;
    });

    configure.mockClear();
    await signOut();
    await signOut();

    expect(configure).toHaveBeenCalledTimes(1);
  });
});
