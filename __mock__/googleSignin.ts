// Jest stand-in for @react-native-google-signin/google-signin.

export const statusCodes = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
};

export const GoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn(() => Promise.resolve(true)),
  signIn: jest.fn(),
  signInSilently: jest.fn(),
  getTokens: jest.fn(),
  revokeAccess: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
};

export const isSuccessResponse = (response?: {type?: string}) =>
  response?.type === 'success';

export const isNoSavedCredentialFoundResponse = (response?: {type?: string}) =>
  response?.type === 'noSavedCredentialFound';

export const isErrorWithCode = (error: unknown): error is {code: string} =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as {code?: unknown}).code === 'string';
