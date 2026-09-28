// Stored category fields. Image assets stay in the presentation catalog.
export type StoredCategory = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
};

export const INCOME_CATEGORY_ID = 'income';

export const isIncomeCategory = (category?: {id: string}) =>
  category?.id === INCOME_CATEGORY_ID;
