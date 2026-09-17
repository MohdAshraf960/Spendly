// Offline Realm client. Bump schemaVersion when stored models change.
import Realm from 'realm';
import {CategorySchema, ExpenseSchema} from './schemas/expense';
import {UserSchema} from './schemas/user';

const realmConfig: Realm.Configuration = {
  schema: [CategorySchema, ExpenseSchema, UserSchema],
  schemaVersion: 4,
};

let realm: Realm | undefined;

// Reuse one open instance so writes from hooks stay in sync.
export const getRealm = () => {
  if (!realm || realm.isClosed) {
    realm = new Realm(realmConfig);
  }
  return realm;
};
