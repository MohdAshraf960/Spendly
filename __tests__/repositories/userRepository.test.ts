import {resetMockRealm} from '../../__mock__/realm';
import {expenseRepository, userRepository} from '../../src/repositories';
import type {GoogleProfile} from '../../src/types/user';

const profile: GoogleProfile = {
  googleId: 'google-1',
  email: 'ada@example.com',
  name: 'Ada',
  photo: 'https://example.com/ada.png',
  idToken: 'token-1',
};

describe('userRepository', () => {
  beforeEach(() => {
    resetMockRealm();
  });

  it('has no session until login', () => {
    expect(userRepository.getCurrent()).toBeUndefined();
  });

  it('stores the Google profile as the current user', () => {
    const user = userRepository.loginWithGoogle(profile);

    expect(user).toMatchObject({
      id: 'current',
      email: 'ada@example.com',
      name: 'Ada',
      googleId: 'google-1',
      idToken: 'token-1',
    });
    expect(userRepository.getCurrent()).toMatchObject({email: 'ada@example.com'});
  });

  it('replaces the previous session on the next login', () => {
    userRepository.loginWithGoogle(profile);
    userRepository.loginWithGoogle({
      ...profile,
      email: 'grace@example.com',
      googleId: 'google-2',
    });

    expect(userRepository.getCurrent()?.email).toBe('grace@example.com');
  });

  it('refreshes the stored ID token', () => {
    userRepository.loginWithGoogle(profile);

    userRepository.updateSessionTokens('token-2');

    expect(userRepository.getCurrent()?.idToken).toBe('token-2');
  });

  it('ignores token and theme updates when nobody is logged in', () => {
    userRepository.updateSessionTokens('token-2');
    userRepository.updateThemePreference('dark');

    expect(userRepository.getCurrent()).toBeUndefined();
  });

  it('persists the theme preference', () => {
    userRepository.loginWithGoogle(profile);

    userRepository.updateThemePreference('dark');

    expect(userRepository.getCurrent()?.themePreference).toBe('dark');
  });

  it('clears the user and the ledger on logout', () => {
    userRepository.loginWithGoogle(profile);
    expenseRepository.add({
      title: 'Milk',
      amount: 10,
      category: {
        id: 'food',
        name: 'Food',
        description: 'Dining',
        imagePath: 'food.webp',
      },
      date: new Date('2026-09-22T10:00:00'),
      note: '',
    });

    userRepository.logout();

    expect(userRepository.getCurrent()).toBeUndefined();
    expect(expenseRepository.getLatestFirst()).toEqual([]);
  });
});
