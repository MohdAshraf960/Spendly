// In-memory stand-in for the Realm calls Spendly actually uses.
// Wired from jest.setup so repositories can be tested without the native DB.

type Listener = () => void;

type Row = Record<string, any>;

const listeners = new Set<Listener>();

const tables: Record<string, Row[]> = {
  Expense: [],
  User: [],
};

const clone = <T>(value: T): T => {
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }
  if (Array.isArray(value)) {
    return value.map(item => clone(item)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, clone(item)]),
    ) as T;
  }
  return value;
};

const notify = () => {
  [...listeners].forEach(listener => listener());
};

const matches = (row: Row, clause: string, args: unknown[]) => {
  const index = Number(clause.match(/\$(\d+)/)?.[1]);
  const value = args[index];

  if (clause.startsWith('title CONTAINS[c]')) {
    return String(row.title)
      .toLowerCase()
      .includes(String(value).toLowerCase());
  }

  if (clause.startsWith('category.id IN')) {
    return (value as string[]).includes(row.category.id);
  }

  if (clause.startsWith('date >=')) {
    return new Date(row.date).getTime() >= new Date(value as Date).getTime();
  }

  if (clause.startsWith('date <=')) {
    return new Date(row.date).getTime() <= new Date(value as Date).getTime();
  }

  throw new Error(`Unsupported Realm query in tests: ${clause}`);
};

class LiveResults {
  private own = new Set<Listener>();

  constructor(private read: () => Row[]) {}

  filtered(query: string, ...args: unknown[]) {
    const clauses = query.split(' AND ').map(clause => clause.trim());
    return new LiveResults(() =>
      this.read().filter(row =>
        clauses.every(clause => matches(row, clause, args)),
      ),
    );
  }

  sorted(field: string, descending = false) {
    return new LiveResults(() =>
      [...this.read()].sort((left, right) => {
        const delta =
          new Date(left[field]).getTime() - new Date(right[field]).getTime();
        return descending ? -delta : delta;
      }),
    );
  }

  map<T>(fn: (row: Row, index: number) => T) {
    return this.read().map(fn);
  }

  addListener(listener: Listener) {
    this.own.add(listener);
    listeners.add(listener);
  }

  removeListener(listener: Listener) {
    this.own.delete(listener);
    listeners.delete(listener);
  }
}

const removeRow = (row: Row) => {
  for (const rows of Object.values(tables)) {
    const index = rows.indexOf(row);
    if (index >= 0) {
      rows.splice(index, 1);
      return;
    }
  }
};

export const resetMockRealm = () => {
  tables.Expense = [];
  tables.User = [];
  listeners.clear();
};

export const getRealm = () => ({
  isClosed: false,
  objects: (name: string) => new LiveResults(() => tables[name] ?? []),
  objectForPrimaryKey: (name: string, id: string) =>
    (tables[name] ?? []).find(row => row._id === id),
  write: (callback: () => void) => {
    callback();
    notify();
  },
  create: (_name: string, value: Row) => {
    const row = clone(value);
    (tables[_name] ??= []).push(row);
    return row;
  },
  delete: (target: Row | LiveResults) => {
    if (target instanceof LiveResults) {
      target.map(row => row).forEach(removeRow);
      return;
    }
    removeRow(target);
  },
  deleteAll: () => {
    tables.Expense = [];
    tables.User = [];
  },
});
