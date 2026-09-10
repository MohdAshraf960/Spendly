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
    imagePath: 'assets/categories/health_grocrey_icon.png',
    image: require('../../../assets/categories/health_grocrey_icon.png'),
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurants, cafes, takeout',
    imagePath: 'assets/categories/food_and_drink.png',
    image: require('../../../assets/categories/food_and_drink.png'),
  },
  {
    id: 'fuel',
    name: 'Fuel & Transport',
    description: 'Uber, metro, fuel',
    imagePath: 'assets/categories/fuel_transport.png',
    image: require('../../../assets/categories/fuel_transport.png'),
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    description: 'Electricity, water, internet',
    imagePath: 'assets/categories/bills_and_utilities.png',
    image: require('../../../assets/categories/bills_and_utilities.png'),
  },
  {
    id: 'housing',
    name: 'Housing',
    description: 'Rent, maintenance, repairs',
    imagePath: 'assets/categories/housing.png',
    image: require('../../../assets/categories/housing.png'),
  },
  {
    id: 'shopping',
    name: 'Shopping & Retail',
    description: 'Clothes, electronics, extras',
    imagePath: 'assets/categories/shopping_retail.png',
    image: require('../../../assets/categories/shopping_retail.png'),
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, games, subscriptions',
    imagePath: 'assets/categories/entertainment.png',
    image: require('../../../assets/categories/entertainment.png'),
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Pharmacy, clinic, wellness',
    imagePath: 'assets/categories/health.png',
    image: require('../../../assets/categories/health.png'),
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Flights, hotels, trips',
    imagePath: 'assets/categories/travel.png',
    image: require('../../../assets/categories/travel.png'),
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Courses, books, fees',
    imagePath: 'assets/categories/education.png',
    image: require('../../../assets/categories/education.png'),
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Kids, dependents, home needs',
    imagePath: 'assets/categories/family.png',
    image: require('../../../assets/categories/family.png'),
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Self-care and personal spend',
    imagePath: 'assets/categories/personal.png',
    image: require('../../../assets/categories/personal.png'),
  },
  {
    id: 'gifts',
    name: 'Gifts',
    description: 'Presents and celebrations',
    imagePath: 'assets/categories/gifts.png',
    image: require('../../../assets/categories/gifts.png'),
  },
  {
    id: 'investments',
    name: 'Investments',
    description: 'Savings, funds, markets',
    imagePath: 'assets/categories/investments.png',
    image: require('../../../assets/categories/investments.png'),
  },
  {
    id: 'income',
    name: 'Income',
    description: 'Salary, freelance, other in',
    imagePath: 'assets/categories/income.png',
    image: require('../../../assets/categories/income.png'),
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Everything else',
    imagePath: 'assets/categories/other_icon.png',
    image: require('../../../assets/categories/other_icon.png'),
  },
];

const unknownCategoryImage = require('../../../assets/categories/unknown_icon.png');

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
  CATEGORIES.find(item => item.imagePath === category.imagePath)?.image ??
  unknownCategoryImage;

export const toCategory = (stored: StoredCategory): Category =>
  getCategoryById(stored.id) ?? {
    ...stored,
    image: getCategoryImage(stored),
  };
