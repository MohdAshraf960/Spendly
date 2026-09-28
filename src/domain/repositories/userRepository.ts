import type {GoogleProfile, ThemePreference, User} from '../entities/user';

export interface UserRepository {
  getCurrent(): User | undefined;
  loginWithGoogle(profile: GoogleProfile): User;
  updateSessionTokens(idToken?: string): void;
  updateThemePreference(pref: ThemePreference): void;
  logout(): void;
  subscribe(onChange: (user: User | undefined) => void): () => void;
}
