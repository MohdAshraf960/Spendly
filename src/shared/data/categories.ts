// Catalog plus helpers to resolve a stored category back to its image.
import type {ImageSourcePropType} from 'react-native';

export type StoredCategory = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  image: ImageSourcePropType;
};

export const CATEGORIES: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries & Daily Supplies',
    description: 'Pantry, supermarket, milk',
    imagePath: 'assets/categories/health_grocrey_icon.webp',
    image: require('../../../assets/categories/health_grocrey_icon.webp'),
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurants, cafes, takeout',
    imagePath: 'assets/categories/food_and_drink.webp',
    image: require('../../../assets/categories/food_and_drink.webp'),
  },
  {
    id: 'fuel',
    name: 'Fuel & Transport',
    description: 'Uber, metro, fuel',
    imagePath: 'assets/categories/fuel_transport.webp',
    image: require('../../../assets/categories/fuel_transport.webp'),
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    description: 'Electricity, water, internet',
    imagePath: 'assets/categories/bills_and_utilities.webp',
    image: require('../../../assets/categories/bills_and_utilities.webp'),
  },
  {
    id: 'housing',
    name: 'Housing',
    description: 'Rent, maintenance, repairs',
    imagePath: 'assets/categories/housing.webp',
    image: require('../../../assets/categories/housing.webp'),
  },
  {
    id: 'shopping',
    name: 'Shopping & Retail',
    description: 'Clothes, electronics, extras',
    imagePath: 'assets/categories/shopping_retail.webp',
    image: require('../../../assets/categories/shopping_retail.webp'),
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, games, subscriptions',
    imagePath: 'assets/categories/entertainment.webp',
    image: require('../../../assets/categories/entertainment.webp'),
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Pharmacy, clinic, wellness',
    imagePath: 'assets/categories/health.webp',
    image: require('../../../assets/categories/health.webp'),
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Flights, hotels, trips',
    imagePath: 'assets/categories/travel.webp',
    image: require('../../../assets/categories/travel.webp'),
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Courses, books, fees',
    imagePath: 'assets/categories/education.webp',
    image: require('../../../assets/categories/education.webp'),
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Kids, dependents, home needs',
    imagePath: 'assets/categories/family.webp',
    image: require('../../../assets/categories/family.webp'),
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Self-care and personal spend',
    imagePath: 'assets/categories/personal.webp',
    image: require('../../../assets/categories/personal.webp'),
  },
  {
    id: 'gifts',
    name: 'Gifts',
    description: 'Presents and celebrations',
    imagePath: 'assets/categories/gifts.webp',
    image: require('../../../assets/categories/gifts.webp'),
  },
  {
    id: 'investments',
    name: 'Investments',
    description: 'Savings, funds, markets',
    imagePath: 'assets/categories/investments.webp',
    image: require('../../../assets/categories/investments.webp'),
  },
  {
    id: 'income',
    name: 'Income',
    description: 'Salary, freelance, other in',
    imagePath: 'assets/categories/income.webp',
    image: require('../../../assets/categories/income.webp'),
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Everything else',
    imagePath: 'assets/categories/other_icon.webp',
    image: require('../../../assets/categories/other_icon.webp'),
  },
];

const unknownCategoryImage = require('../../../assets/categories/unknown_icon.webp');

// Income is money in. Every other category is treated as a spend.
export const INCOME_CATEGORY_ID = 'income';

export const isIncomeCategory = (category?: {id: string}) =>
  category?.id === INCOME_CATEGORY_ID;

export const getCategoryById = (id?: string) =>
  CATEGORIES.find(category => category.id === id);

export const getCategoryImage = (category: {
  id: string;
  imagePath: string;
}) =>
  getCategoryById(category.id)?.image ??
  CATEGORIES.find(
    item =>
      item.imagePath === category.imagePath ||
      item.imagePath.replace(/\.webp$/, '.png') === category.imagePath,
  )?.image ??
  unknownCategoryImage;

export const toCategory = (stored: StoredCategory): Category =>
  getCategoryById(stored.id) ?? {
    ...stored,
    image: getCategoryImage(stored),
  };
