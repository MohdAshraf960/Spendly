import {useCallback, useState} from 'react';
import {userRepository} from '../data/userRepository';
import {signOutFromGoogle} from '../services/googleAuth';

// Signs out of Google (for Google sessions), then wipes local user + expenses.
const useLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      const current = userRepository.getCurrent();
      if (current?.provider === 'google') {
        await signOutFromGoogle();
      }
      userRepository.logout();
    } finally {
      setLoggingOut(false);
    }
  }, []);

  return {logout, loggingOut};
};

export default useLogout;
