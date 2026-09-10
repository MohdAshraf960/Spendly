// Login field rules. Returns a message or undefined when valid.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();

  if (!email) {
    return 'Email is required';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Enter a valid email address';
  }

  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return undefined;
};
