import {getRealm} from '../../../core/database/realm';
import type {
  CreateExpenseInput,
  Expense,
  ExpenseQuery,
  StoredCategory,
} from './types';

type RealmCategory = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
};

type RealmExpense = {
  _id: string;
  title: string;
  amount: number;
  category: RealmCategory;
  date: Date;
  note: string;
  createdAt: Date;
};

// Copies Realm objects into plain JS so list screens can render safely.
const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;

const toStoredCategory = (category: RealmCategory): StoredCategory => ({
  id: category.id,
  name: category.name,
  description: category.description,
  imagePath: category.imagePath,
});

const toExpense = (expense: RealmExpense): Expense => ({
  id: expense._id,
  title: expense.title,
  amount: expense.amount,
  category: toStoredCategory(expense.category),
  date: new Date(expense.date),
  note: expense.note,
  createdAt: new Date(expense.createdAt),
});

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const queryExpenses = (query: ExpenseQuery = {}) => {
  let results = getRealm().objects<RealmExpense>('Expense');
  const clauses: string[] = [];
  const args: unknown[] = [];

  const search = query.search?.trim();
  if (search) {
    clauses.push(`title CONTAINS[c] $${args.length}`);
    args.push(search);
  }

  if (query.categoryIds?.length) {
    clauses.push(`category.id IN $${args.length}`);
    args.push(query.categoryIds);
  }

  if (query.fromDate) {
    clauses.push(`date >= $${args.length}`);
    args.push(startOfDay(query.fromDate));
  }

  if (query.endDate) {
    clauses.push(`date <= $${args.length}`);
    args.push(endOfDay(query.endDate));
  }

  if (clauses.length) {
    results = results.filtered(clauses.join(' AND '), ...args);
  }

  return results.sorted('createdAt', true);
};

// Offline ledger writes. Home subscribes so new saves appear immediately.
export class ExpenseRepository {
  add(input: CreateExpenseInput): Expense {
    const realm = getRealm();
    const createdAt = new Date();
    const _id = createId();

    realm.write(() => {
      realm.create<RealmExpense>('Expense', {
        _id,
        title: input.title,
        amount: input.amount,
        category: input.category,
        date: input.date,
        note: input.note,
        createdAt,
      });
    });

    return {
      id: _id,
      title: input.title,
      amount: input.amount,
      category: input.category,
      date: input.date,
      note: input.note,
      createdAt,
    };
  }

  getById(id: string): Expense | undefined {
    const expense = getRealm().objectForPrimaryKey<RealmExpense>('Expense', id);
    return expense ? toExpense(expense) : undefined;
  }

  update(id: string, input: CreateExpenseInput): Expense | undefined {
    const realm = getRealm();
    const expense = realm.objectForPrimaryKey<RealmExpense>('Expense', id);
    if (!expense) {
      return undefined;
    }

    realm.write(() => {
      expense.title = input.title;
      expense.amount = input.amount;
      expense.category.id = input.category.id;
      expense.category.name = input.category.name;
      expense.category.description = input.category.description;
      expense.category.imagePath = input.category.imagePath;
      expense.date = input.date;
      expense.note = input.note;
    });

    return toExpense(expense);
  }

  delete(id: string) {
    const realm = getRealm();
    const expense = realm.objectForPrimaryKey<RealmExpense>('Expense', id);
    if (!expense) {
      return;
    }

    realm.write(() => {
      realm.delete(expense);
    });
  }

  getAllLatestFirst(): Expense[] {
    return this.getLatestFirst();
  }

  getLatestFirst(query: ExpenseQuery = {}): Expense[] {
    return queryExpenses(query).map(toExpense);
  }

  // Realm fires immediately and on every write. Caller must unsubscribe.
  subscribe(
    onChange: (expenses: Expense[]) => void,
    query: ExpenseQuery = {},
  ) {
    const results = queryExpenses(query);

    const listener = () => {
      onChange(results.map(toExpense));
    };

    results.addListener(listener);
    return () => {
      results.removeListener(listener);
    };
  }
}

export const expenseRepository = new ExpenseRepository();
