// App-facing user shape. Realm uses `_id`; we expose `id`.
export type User = {
  id: string;
  email: string;
  name?: string;
  photo?: string;
  googleId?: string;
  // Latest Google ID token for the active session (refreshed on app start).
  idToken?: string;
  createdAt: Date;
};

// Normalised profile returned by the Google Sign-In SDK.
export type GoogleProfile = {
  googleId: string;
  email: string;
  name?: string;
  photo?: string;
  idToken?: string;
};
