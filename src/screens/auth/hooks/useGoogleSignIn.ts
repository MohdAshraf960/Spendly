import {useCallback, useState} from 'react';
import {signInWithGoogle as signIn} from '../../../composition';
import {useTheme} from '../../../shared/context';
import type {User} from '../../../domain/entities';

const useGoogleSignIn = () => {
  const [signing, setSigning] = useState(false);
  const {refreshThemePreference} = useTheme();

  const signInWithGoogle = useCallback(async (): Promise<User | undefined> => {
    setSigning(true);
    try {
      const user = await signIn();
      if (user) {
        refreshThemePreference();
      }
      return user;
    } finally {
      setSigning(false);
    }
  }, [refreshThemePreference]);

  return {signInWithGoogle, signing};
};

export default useGoogleSignIn;
