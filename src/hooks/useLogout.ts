import {useCallback, useState} from 'react';
import {userRepository} from '../repositories/userRepository';
import {signOutFromGoogle} from '../services/googleAuth';
import {useTheme} from '../shared/context';

// Revokes + signs out of Google, then wipes local user + expenses and resets theme to system default.
const useLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const {resetThemePreference} = useTheme();

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await signOutFromGoogle();
      userRepository.logout();
      resetThemePreference();
    } finally {
      setLoggingOut(false);
    }
  }, [resetThemePreference]);

  return {logout, loggingOut};
};

export default useLogout;
