// Expense stores the full category object (embedded), not just an id.
import type {ObjectSchema} from 'realm';

export const CategorySchema: ObjectSchema = {
  name: 'Category',
  embedded: true,
  properties: {
    id: 'string',
    name: 'string',
    description: 'string',
    imagePath: 'string',
  },
};

export const ExpenseSchema: ObjectSchema = {
  name: 'Expense',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    title: 'string',
    amount: 'double',
    category: 'Category',
    date: 'date',
    note: 'string',
    createdAt: 'date',
  },
};
