// Local session user. Email/password sessions store the password as entered
// (offline-only app); Google sessions store the profile + latest ID token.
import type {ObjectSchema} from 'realm';

export const UserSchema: ObjectSchema = {
  name: 'User',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string',
    provider: {type: 'string', default: 'password'},
    name: 'string?',
    photo: 'string?',
    googleId: 'string?',
    idToken: 'string?',
    password: 'string?',
    createdAt: 'date',
  }
};
