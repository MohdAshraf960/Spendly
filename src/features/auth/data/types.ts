// App-facing user shape. Realm uses `_id`; we expose `id`.
export type AuthProvider = 'password' | 'google';

export type User = {
  id: string;
  email: string;
  provider: AuthProvider;
  name?: string;
  photo?: string;
  googleId?: string;
  // Latest Google ID token for the active session (refreshed on app start).
  idToken?: string;
  // Only set for email/password sessions (offline-only app).
  password?: string;
  createdAt: Date;
};

export type LoginInput = {
  email: string;
  password: string;
};

// Normalised profile returned by the Google Sign-In SDK.
export type GoogleProfile = {
  googleId: string;
  email: string;
  name?: string;
  photo?: string;
  idToken?: string;
};
