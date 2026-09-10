import {useCallback, useState} from 'react';
import {userRepository} from '../data/userRepository';

// Wipes local user and expenses, then the screen resets to Login.
const useLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(() => {
    setLoggingOut(true);
    try {
      userRepository.logout();
    } finally {
      setLoggingOut(false);
    }
  }, []);

  return {logout, loggingOut};
};

export default useLogout;
