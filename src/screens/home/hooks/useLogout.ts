import {useCallback, useState} from 'react';
import {userRepository} from '../../../repositories/userRepository';
import {signOutFromGoogle} from '../../../services/googleAuth';

// Revokes + signs out of Google, then wipes local user + expenses.
const useLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await signOutFromGoogle();
      userRepository.logout();
    } finally {
      setLoggingOut(false);
    }
  }, []);

  return {logout, loggingOut};
};

export default useLogout;
