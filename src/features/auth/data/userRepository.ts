import {getRealm} from '../../../core/database/realm';
import type {GoogleProfile, User} from './types';

type RealmUser = {
  _id: string;
  email: string;
  name?: string;
  photo?: string;
  googleId?: string;
  idToken?: string;
  createdAt: Date;
};

// One local session at a time. Login replaces the previous user row.
const CURRENT_USER_ID = 'current';

const toUser = (user: RealmUser): User => ({
  id: user._id,
  email: user.email,
  name: user.name,
  photo: user.photo,
  googleId: user.googleId,
  idToken: user.idToken,
  createdAt: new Date(user.createdAt),
});

export class UserRepository {
  // Single-row session. Splash and Home read this.
  getCurrent(): User | undefined {
    const user = getRealm().objectForPrimaryKey<RealmUser>(
      'User',
      CURRENT_USER_ID,
    );
    return user ? toUser(user) : undefined;
  }

  // Google session. Stores the profile and latest ID token.
  loginWithGoogle(profile: GoogleProfile): User {
    return this.createSession({
      email: profile.email,
      name: profile.name,
      photo: profile.photo,
      googleId: profile.googleId,
      idToken: profile.idToken,
      createdAt: new Date(),
    });
  }

  // Refreshes only the stored ID token for the active session (silent refresh).
  updateSessionTokens(idToken?: string) {
    const realm = getRealm();
    const existing = realm.objectForPrimaryKey<RealmUser>(
      'User',
      CURRENT_USER_ID,
    );
    if (!existing) {
      return;
    }
    realm.write(() => {
      existing.idToken = idToken;
    });
  }

  // Clears the whole Realm so the next login starts with an empty ledger.
  logout() {
    const realm = getRealm();
    realm.write(() => {
      realm.deleteAll();
    });
  }

  private createSession(record: Omit<RealmUser, '_id'>): User {
    const realm = getRealm();
    let created!: RealmUser;
    realm.write(() => {
      realm.delete(realm.objects('User'));
      created = realm.create<RealmUser>('User', {
        _id: CURRENT_USER_ID,
        ...record,
      });
    });
    return toUser(created);
  }
}

export const userRepository = new UserRepository();
