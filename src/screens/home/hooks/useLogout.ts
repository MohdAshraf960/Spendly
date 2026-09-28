import {useCallback, useState} from 'react';
import {signOut} from '../../../composition';
import {useTheme} from '../../../shared/context';

const useLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const {resetThemePreference} = useTheme();

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await signOut();
      resetThemePreference();
    } finally {
      setLoggingOut(false);
    }
  }, [resetThemePreference]);

  return {logout, loggingOut};
};

export default useLogout;
