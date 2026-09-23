// Constructor stand-in so src/database/realm.ts can be loaded without the native module.

type RealmConfig = {
  schema: {name: string}[];
  schemaVersion: number;
};

export const realmInstances: {isClosed: boolean; config: RealmConfig}[] = [];

function Realm(this: {isClosed: boolean; config: RealmConfig}, config: RealmConfig) {
  this.isClosed = false;
  this.config = config;
  realmInstances.push(this);
}

export default Realm;
