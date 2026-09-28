// Thrown when the user backs out of the account picker.
export class SignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled.');
    this.name = 'SignInCancelledError';
  }
}
