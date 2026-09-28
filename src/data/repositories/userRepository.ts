import {getRealm} from '../local/realm';
import type {UserRepository} from '../../domain/repositories/userRepository';
import type {GoogleProfile, ThemePreference, User} from '../../domain/entities/user';

type RealmUser = {
  _id: string;
  email: string;
  name?: string;
  photo?: string;
  googleId?: string;
  idToken?: string;
  themePreference?: string;
  createdAt: Date;
};

const CURRENT_USER_ID = 'current';

const toUser = (user: RealmUser): User => ({
  id: user._id,
  email: user.email,
  name: user.name,
  photo: user.photo,
  googleId: user.googleId,
  idToken: user.idToken,
  themePreference: user.themePreference as ThemePreference | undefined,
  createdAt: new Date(user.createdAt),
});

export class RealmUserRepository implements UserRepository {
  getCurrent(): User | undefined {
    const user = getRealm().objectForPrimaryKey<RealmUser>(
      'User',
      CURRENT_USER_ID,
    );
    return user ? toUser(user) : undefined;
  }

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

  updateThemePreference(pref: ThemePreference) {
    const realm = getRealm();
    const existing = realm.objectForPrimaryKey<RealmUser>(
      'User',
      CURRENT_USER_ID,
    );
    if (!existing) {
      return;
    }
    realm.write(() => {
      existing.themePreference = pref;
    });
  }

  logout() {
    const realm = getRealm();
    realm.write(() => {
      realm.deleteAll();
    });
  }

  subscribe(onChange: (user: User | undefined) => void) {
    const results = getRealm().objects<RealmUser>('User');
    const listener = () => {
      onChange(this.getCurrent());
    };
    results.addListener(listener);
    return () => {
      results.removeListener(listener);
    };
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

export const userRepository = new RealmUserRepository();
