import {googleAuthGateway} from '../data/auth';
import {expenseRepository, userRepository} from '../data/repositories';
import {
  hasAddExpenseErrors,
  validateAddExpense,
  type AddExpenseErrors,
  type AddExpenseValues,
} from '../domain/usecases/validateAddExpense';
import {getLedgerStats} from '../domain/usecases/getLedgerStats';
import {
  createAddExpense,
  createDeleteExpense,
  createGetExpense,
  createGetExpenses,
  createSubscribeToExpenses,
  createUpdateExpense,
} from '../domain/usecases/expenseUseCases';
import {
  createGetCurrentUser,
  createRestoreSession,
  createSignIn,
  createSignOut,
  createSubscribeToCurrentUser,
  createUpdateThemePreference,
} from '../domain/usecases/sessionUseCases';

export const addExpense = createAddExpense(expenseRepository);
export const updateExpense = createUpdateExpense(expenseRepository);
export const deleteExpense = createDeleteExpense(expenseRepository);
export const getExpense = createGetExpense(expenseRepository);
export const getExpenses = createGetExpenses(expenseRepository);
export const subscribeToExpenses =
  createSubscribeToExpenses(expenseRepository);

export const signInWithGoogle = createSignIn(googleAuthGateway, userRepository);
export const signOut = createSignOut(googleAuthGateway, userRepository);
export const restoreSession = createRestoreSession(
  googleAuthGateway,
  userRepository,
);
export const getCurrentUser = createGetCurrentUser(userRepository);
export const updateThemePreference =
  createUpdateThemePreference(userRepository);
export const subscribeToCurrentUser =
  createSubscribeToCurrentUser(userRepository);

export {getLedgerStats, hasAddExpenseErrors, validateAddExpense};
export type {AddExpenseErrors, AddExpenseValues};
