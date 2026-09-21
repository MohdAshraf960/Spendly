import {useCallback, useState} from 'react';
import {userRepository} from '../../../repositories/userRepository';
import { signInWithGoogle, GoogleSignInCancelledError } from '../../../services';
import { useTheme } from '../../../shared/context';
import { User } from '../../../types';


// Runs the interactive Google flow, then persists the session locally.
// Resolves to `undefined` when the user cancels the account picker.
const useGoogleSignIn = () => {
  const [signing, setSigning] = useState(false);
  const {refreshThemePreference} = useTheme();

  const signIn = useCallback(async (): Promise<User | undefined> => {
    setSigning(true);
    try {
      const profile = await signInWithGoogle();
      const user = userRepository.loginWithGoogle(profile);
      refreshThemePreference();
      return user;
    } catch (error) {
      if (error instanceof GoogleSignInCancelledError) {
        return undefined;
      }
      throw error;
    } finally {
      setSigning(false);
    }
  }, [refreshThemePreference]);

  return {signInWithGoogle: signIn, signing};
};

export default useGoogleSignIn;
