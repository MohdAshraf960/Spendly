// Local session user. Password is stored as entered (offline-only app).
import type {ObjectSchema} from 'realm';

export const UserSchema: ObjectSchema = {
  name: 'User',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string',
    password: 'string',
    createdAt: 'date',
  },
};
