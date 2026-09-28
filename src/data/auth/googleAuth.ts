// Google Sign-In adapter. Persisting the session stays in the user repository.
import {
  GoogleSignin,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {GOOGLE_WEB_CLIENT_ID as WEB_CLIENT_ID_FROM_ENV} from '@env';
import type {GoogleProfile} from '../../domain/entities/user';
import {SignInCancelledError} from '../../domain/errors/signInCancelledError';
import type {AuthGateway} from '../../domain/repositories/authGateway';

export const GOOGLE_WEB_CLIENT_ID = WEB_CLIENT_ID_FROM_ENV;

let configured = false;

export const configureGoogleSignIn = () => {
  if (configured) {
    return;
  }
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      'GOOGLE_WEB_CLIENT_ID is missing. Copy .env.example to .env and set it, then rebuild the app.',
    );
  }
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
  configured = true;
};

type SdkUser = {
  id: string;
  email: string;
  name?: string | null;
  photo?: string | null;
};

const mapProfile = (data: {
  idToken?: string | null;
  user: SdkUser;
}): GoogleProfile => ({
  googleId: data.user.id,
  email: data.user.email,
  name: data.user.name ?? undefined,
  photo: data.user.photo ?? undefined,
  idToken: data.idToken ?? undefined,
});

export {SignInCancelledError as GoogleSignInCancelledError};

export const signInWithGoogle = async (): Promise<GoogleProfile> => {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  try {
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      throw new SignInCancelledError();
    }
    return mapProfile(response.data);
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === statusCodes.SIGN_IN_CANCELLED
    ) {
      throw new SignInCancelledError();
    }
    throw error;
  }
};

export const refreshGoogleSession = async (): Promise<
  GoogleProfile | undefined
> => {
  configureGoogleSignIn();

  try {
    const response = await GoogleSignin.signInSilently();

    if (isNoSavedCredentialFoundResponse(response)) {
      return undefined;
    }

    try {
      const tokens = await GoogleSignin.getTokens();

      return mapProfile({
        user: response.data.user,
        idToken: tokens.idToken,
      });
    } catch {
      return mapProfile(response.data);
    }
  } catch {
    return undefined;
  }
};

export const signOutFromGoogle = async (): Promise<void> => {
  configureGoogleSignIn();
  try {
    await GoogleSignin.revokeAccess();
  } catch {
    // Ignore: access may already be revoked, or there is no active session.
  }
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore: nothing to do if the SDK has no active session.
  }
};

export const googleAuthGateway: AuthGateway = {
  signIn: signInWithGoogle,
  signOut: signOutFromGoogle,
  refreshSession: refreshGoogleSession,
};
