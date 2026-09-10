// App-facing user shape. Realm uses `_id`; we expose `id`.
export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type LoginInput = {
  email: string;
  password: string;
};
