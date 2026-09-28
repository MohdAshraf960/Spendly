import type {ThemePreference, User} from '../entities/user';
import {SignInCancelledError} from '../errors/signInCancelledError';
import type {AuthGateway} from '../repositories/authGateway';
import type {UserRepository} from '../repositories/userRepository';

export const createSignIn =
  (auth: AuthGateway, users: UserRepository) =>
  async (): Promise<User | undefined> => {
    try {
      const profile = await auth.signIn();
      return users.loginWithGoogle(profile);
    } catch (error) {
      if (error instanceof SignInCancelledError) {
        return undefined;
      }
      throw error;
    }
  };

export const createSignOut =
  (auth: AuthGateway, users: UserRepository) => async () => {
    await auth.signOut();
    users.logout();
  };

// Keeps the local session when silent refresh fails, and skips refresh when
// nobody is signed in.
export const createRestoreSession =
  (auth: AuthGateway, users: UserRepository) =>
  async (): Promise<User | undefined> => {
    if (!users.getCurrent()) {
      return undefined;
    }

    try {
      const profile = await auth.refreshSession();
      if (profile) {
        users.updateSessionTokens(profile.idToken);
      }
    } catch {
      // Local session stays valid if Google cannot be reached.
    }

    return users.getCurrent();
  };

export const createGetCurrentUser = (users: UserRepository) => () =>
  users.getCurrent();

export const createUpdateThemePreference =
  (users: UserRepository) => (pref: ThemePreference) =>
    users.updateThemePreference(pref);

export const createSubscribeToCurrentUser =
  (users: UserRepository) => (onChange: (user: User | undefined) => void) =>
    users.subscribe(onChange);
