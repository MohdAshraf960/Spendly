import {useCallback, useState} from 'react';
import type {LoginInput, User} from '../data/types';
import {userRepository} from '../data/userRepository';

// Persists the signed-in user after login validation succeeds.
const useLogin = () => {
  const [saving, setSaving] = useState(false);

  const login = useCallback((input: LoginInput): User => {
    setSaving(true);
    try {
      return userRepository.login({
        email: input.email.trim().toLowerCase(),
        password: input.password,
      });
    } finally {
      setSaving(false);
    }
  }, []);

  return {login, saving};
};

export default useLogin;
