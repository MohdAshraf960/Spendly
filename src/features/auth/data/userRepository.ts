import {getRealm} from '../../../core/database/realm';
import type {LoginInput, User} from './types';

type RealmUser = {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
};

// One local session at a time. Login replaces the previous user row.
const CURRENT_USER_ID = 'current';

const toUser = (user: RealmUser): User => ({
  id: user._id,
  email: user.email,
  password: user.password,
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

  login({email, password}: LoginInput): User {
    const realm = getRealm();
    const createdAt = new Date();

    realm.write(() => {
      const existing = realm.objects('User');
      realm.delete(existing);
      realm.create<RealmUser>('User', {
        _id: CURRENT_USER_ID,
        email,
        password,
        createdAt,
      });
    });

    return {
      id: CURRENT_USER_ID,
      email,
      password,
      createdAt,
    };
  }

  // Clears the whole Realm so the next login starts with an empty ledger.
  logout() {
    const realm = getRealm();
    realm.write(() => {
      realm.deleteAll();
    });
  }
}

export const userRepository = new UserRepository();
