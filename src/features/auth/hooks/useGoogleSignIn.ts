import {useCallback, useState} from 'react';
import type {User} from '../data/types';
import {userRepository} from '../data/userRepository';
import {
  GoogleSignInCancelledError,
  signInWithGoogle,
} from '../services/googleAuth';

// Runs the interactive Google flow, then persists the session locally.
// Resolves to `undefined` when the user cancels the account picker.
const useGoogleSignIn = () => {
  const [signing, setSigning] = useState(false);

  const signIn = useCallback(async (): Promise<User | undefined> => {
    setSigning(true);
    try {
      const profile = await signInWithGoogle();
      return userRepository.loginWithGoogle(profile);
    } catch (error) {
      if (error instanceof GoogleSignInCancelledError) {
        return undefined;
      }
      throw error;
    } finally {
      setSigning(false);
    }
  }, []);

  return {signInWithGoogle: signIn, signing};
};

export default useGoogleSignIn;
