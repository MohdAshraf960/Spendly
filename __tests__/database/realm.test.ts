import {CategorySchema, ExpenseSchema} from '../../src/database/schemas/expense';
import {UserSchema} from '../../src/database/schemas/user';

jest.mock('realm', () => require('../../__mock__/realmNative'));

jest.unmock('../../src/database/realm');

describe('Realm schemas', () => {
  it('stores an expense with an embedded category', () => {
    expect(ExpenseSchema.name).toBe('Expense');
    expect(ExpenseSchema.primaryKey).toBe('_id');
    expect(ExpenseSchema.properties).toMatchObject({
      title: 'string',
      amount: 'double',
      category: 'Category',
      date: 'date',
    });
    expect(CategorySchema).toMatchObject({name: 'Category', embedded: true});
  });

  it('stores one local user keyed by _id', () => {
    expect(UserSchema.name).toBe('User');
    expect(UserSchema.primaryKey).toBe('_id');
    expect(UserSchema.properties).toMatchObject({
      email: 'string',
      themePreference: 'string?',
      idToken: 'string?',
    });
  });
});

describe('getRealm', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const load = () => {
    const {getRealm} = require('../../src/database/realm') as typeof import('../../src/database/realm');
    const {realmInstances} = require('../../__mock__/realmNative') as typeof import('../../__mock__/realmNative');
    return {getRealm, realmInstances};
  };

  it('opens schema version 5 once and reuses the instance', () => {
    const {getRealm, realmInstances} = load();

    const first = getRealm();
    const second = getRealm();

    expect(second).toBe(first);
    expect(realmInstances).toHaveLength(1);
    expect(first.config.schemaVersion).toBe(5);
    expect(first.config.schema.map(schema => schema.name)).toEqual([
      'Category',
      'Expense',
      'User',
    ]);
  });

  it('opens a new instance after the previous one is closed', () => {
    const {getRealm, realmInstances} = load();
    const first = getRealm();
    first.isClosed = true;

    const second = getRealm();

    expect(second).not.toBe(first);
    expect(realmInstances).toHaveLength(2);
  });
});
