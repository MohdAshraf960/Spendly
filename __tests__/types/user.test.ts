import type {GoogleProfile, User} from '../../src/types';
import type {ThemePreference} from '../../src/types/user';

const preferences: ThemePreference[] = ['light', 'dark', 'system'];

const user = {
  id: 'current',
  email: 'ada@example.com',
  name: 'Ada',
  photo: 'https://example.com/ada.png',
  googleId: 'google-1',
  idToken: 'token-1',
  themePreference: 'dark',
  createdAt: new Date('2026-09-22T10:00:00'),
} satisfies User;

const profile = {
  googleId: 'google-1',
  email: 'ada@example.com',
  name: 'Ada',
  photo: 'https://example.com/ada.png',
  idToken: 'token-1',
} satisfies GoogleProfile;

describe('ThemePreference', () => {
  it('allows light, dark, and system', () => {
    expect(preferences).toEqual(['light', 'dark', 'system']);
  });
});

describe('User', () => {
  it('exposes the session id, email, and created time', () => {
    expect(user).toMatchObject({
      id: 'current',
      email: 'ada@example.com',
      themePreference: 'dark',
    });
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('allows a user who has not set a name, photo, or theme', () => {
    const minimal = {
      id: 'current',
      email: 'ada@example.com',
      createdAt: new Date('2026-09-22T10:00:00'),
    } satisfies User;

    expect(minimal.name).toBeUndefined();
    expect(minimal.photo).toBeUndefined();
    expect(minimal.googleId).toBeUndefined();
    expect(minimal.idToken).toBeUndefined();
    expect(minimal.themePreference).toBeUndefined();
  });
});

describe('GoogleProfile', () => {
  it('keeps the Google id, email, and token', () => {
    expect(profile).toEqual({
      googleId: 'google-1',
      email: 'ada@example.com',
      name: 'Ada',
      photo: 'https://example.com/ada.png',
      idToken: 'token-1',
    });
  });

  it('allows a profile without a name, photo, or token', () => {
    const minimal = {
      googleId: 'google-1',
      email: 'ada@example.com',
    } satisfies GoogleProfile;

    expect(minimal.name).toBeUndefined();
    expect(minimal.photo).toBeUndefined();
    expect(minimal.idToken).toBeUndefined();
  });
});
