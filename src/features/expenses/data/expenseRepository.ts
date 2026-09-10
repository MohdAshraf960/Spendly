import {getRealm} from '../../../core/database/realm';
import type {CreateExpenseInput, Expense, StoredCategory} from './types';

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
    return getRealm()
      .objects<RealmExpense>('Expense')
      .sorted('createdAt', true)
      .map(toExpense);
  }

  // Realm fires immediately and on every write. Caller must unsubscribe.
  subscribe(onChange: (expenses: Expense[]) => void) {
    const results = getRealm()
      .objects<RealmExpense>('Expense')
      .sorted('createdAt', true);

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
