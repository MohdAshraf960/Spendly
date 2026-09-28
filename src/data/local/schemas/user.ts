// Local session user. Google-only sign-in: stores the profile + latest ID token.
import type {ObjectSchema} from 'realm';

export const UserSchema: ObjectSchema = {
  name: 'User',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string',
    name: 'string?',
    photo: 'string?',
    googleId: 'string?',
    idToken: 'string?',
    themePreference: 'string?',
    createdAt: 'date',
  },
};
