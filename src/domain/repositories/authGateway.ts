import type {GoogleProfile} from '../entities/user';

export interface AuthGateway {
  signIn(): Promise<GoogleProfile>;
  signOut(): Promise<void>;
  refreshSession(): Promise<GoogleProfile | undefined>;
}
