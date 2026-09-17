// Google Sign-In (native) wrapper. Owns SDK configuration, interactive
// sign-in, silent session refresh, and sign-out. Persisting the session to the
// local DB is handled separately by userRepository.
import {
  GoogleSignin,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {GOOGLE_WEB_CLIENT_ID as WEB_CLIENT_ID_FROM_ENV} from '@env';
import type {GoogleProfile} from '../types/user';

// The *Web* OAuth 2.0 client ID (from Google Cloud Console -> APIs & Services ->
// Credentials -> "Web application") is loaded from `.env`. Required so an
// `idToken` is returned on both Android and iOS. See `.env.example`.
// Re-exported via a local const (react-native-dotenv cannot re-export `@env`
// bindings directly with an export specifier).
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
    // Ask for a server auth code so tokens can be refreshed silently later.
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

// Thrown when the user backs out of the Google account picker.
export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled.');
    this.name = 'GoogleSignInCancelledError';
  }
}

// Interactive sign-in. Throws GoogleSignInCancelledError on user cancel.
export const signInWithGoogle = async (): Promise<GoogleProfile> => {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  try {
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      throw new GoogleSignInCancelledError();
    }
    return mapProfile(response.data);
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === statusCodes.SIGN_IN_CANCELLED
    ) {
      throw new GoogleSignInCancelledError();
    }
    throw error;
  }
};

// Silent refresh used on app start. Returns undefined when there is no cached
// Google session (e.g. access was revoked or never granted on this device).
export const refreshGoogleSession = async (): Promise<
  GoogleProfile | undefined
> => {
  configureGoogleSignIn();

  try {
    const response = await GoogleSignin.signInSilently();

    if (isNoSavedCredentialFoundResponse(response)) {
      return undefined;
    }

    // At this point response is SignInSuccessResponse
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

// Best-effort sign-out + access revocation on logout. `revokeAccess` disconnects
// the app from the Google account (invalidating the granted tokens/scopes on
// Google's side, so the next sign-in re-prompts for consent); `signOut` then
// clears the cached local session. Each runs independently so a failure in one
// (e.g. no network when revoking) still lets the other proceed. The local DB
// session is cleared by the caller regardless of the outcome here.
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
