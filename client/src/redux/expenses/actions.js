import { get, set, update } from 'idb-keyval';
import api from '../../utils/api';
import * as actions from './types';
import { addMessage, addError } from '../notifications/actions';
import { createEncryptedSnapshot } from '../../utils/snapshot';
import { selectCurrentWallet } from '../wallets/selectors';
import { selectCurrentMMYY } from '../filters/selectors';
import {
  generateIndexDBKey,
  parseDateIntoMMYY,
  decryptExpensesWithWorkers
} from '../../utils/expenses';

export const addExpense = (expense = {}) => ({
  type: actions.ADD_EXPENSE,
  payload: expense
});

export const removeExpense = (expenseId) => ({
  type: actions.REMOVE_EXPENSE,
  payload: expenseId
});

export const removeExpenseImage = (id = '') => ({
  type: actions.REMOVE_EXPENSE_IMAGE,
  payload: id
});

export const updateExpense = (expense = {}) => ({
  type: actions.UPDATE_EXPENSE,
  payload: expense
})

export const updateExpenseImage = (id = '', url = '') => ({
  type: actions.UPDATE_EXPENSE_IMAGE,
  payload: { id, url }
});

export const setExpenses = (expenses = []) => ({
  type: actions.SET_EXPENSES,
  payload: expenses
});

export const startGetExpenses = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actions.START_EXPENSES_LOADING });
      // These are used for identifying missing
      const state = getState();
      const { id } = selectCurrentWallet(state);
      const mmyy = selectCurrentMMYY(state);
      const indexDBKey = generateIndexDBKey(state, 'expenses');

      // Try to get expenses from local storage (indexedDB)
      let expenses = await get(indexDBKey);
      if (expenses) return dispatch(setExpenses(expenses));

      // If there are none make a network request, decrypt them and save them for later use
      expenses = await api.get(`/wallet/s/${id}?0=${mmyy}`);
      const decryptedExpenses = await decryptExpensesWithWorkers(expenses.data);
      await set(indexDBKey, decryptedExpenses);
      dispatch(setExpenses(decryptedExpenses));
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
      dispatch(setExpenses([]));
    } finally {
      dispatch({ type: actions.STOP_EXPENSES_LOADING });
    }
  };
};

// export const startGetExpenses = () => {
//   return (dispatch, getState) => {
//     dispatch({ type: actions.START_EXPENSES_LOADING });
//
//     // These are used for identifying missing
//     const state = getState();
//     const { id } = selectCurrentWallet(state);
//     const mmyy = selectCurrentMMYY(state);
//     const indexDBKey = generateIndexDBKey(state, 'expenses');
//
//     // Attempt to get expenses from indexedDB
//     get(indexDBKey)
//       .then(expenses => {
//         if (expenses) {
//           dispatch(setExpenses(expenses));
//           dispatch({ type: actions.STOP_EXPENSES_LOADING });
//           return;
//         }
//         // If there are no expenses saved locally then make a network request
//         // Fetches all expenses for the current wallet and current month/year (expressed as MMYY format)
//         // It returns an array with objects containing the encrypted expense data.
//         api.get(`/wallet/s/${id}?0=${mmyy}`)
//           .then(async expenses => {
//             console.log('1')
//             const decryptedExpenses = await decryptExpensesWithWorkers(expenses.data);
//
//             await set(indexDBKey, decryptedExpenses);
//
//             dispatch(setExpenses(decryptedExpenses));
//             dispatch({ type: actions.STOP_EXPENSES_LOADING });
//           })
//       })
//       .catch(err => {
//         const message = err.response ? err.response.data : err.message;
//         dispatch(addError(message));
//         dispatch({ type: actions.STOP_EXPENSES_LOADING });
//         dispatch(setExpenses([]));
//       })
//   };
// };

export const startAddExpense = (expense = {}) => {
  return async dispatch => {
    try {
      dispatch({ type: actions.START_EXPENSES_LOADING });

      // Used for building the indexedDB key and api call
      const { wallet, createdAt } = expense;
      const range = parseDateIntoMMYY(createdAt);
      const indexDBKey = `expenses:${wallet}:${range}`;

      const encryptedData = await createEncryptedSnapshot(expense);
      // server expects an object with a "range" property that describes the
      // month and year of the expense, in the following format: MMYY.
      const payload = {
        range: range,
        data: encryptedData
      };

      const response = await api.post(`/expense/${wallet}`, payload);
      const newExpense = { id: response.data, ...expense };

      // Update local storage (indexedDB) if there's an entry for the expense's mmyy
      const currentEntryExists = await get(indexDBKey);
      const updatedEntry = [...currentEntryExists, newExpense];
      
      if (currentEntryExists) await set(indexDBKey, updatedEntry);


      dispatch(addExpense(newExpense));
      dispatch(addMessage('Expense created successfully.'));
      return true; // Signals component to redirect to expense page
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      console.error(err)
      dispatch(addError(message));
      return false; // Signals component not to redirect
    } finally {
      dispatch({ type: actions.STOP_EXPENSES_LOADING });
    }
  };
};

// export const startAddExpense = (expense = {}) => {
//   return dispatch => {
//
//     dispatch({ type: actions.START_EXPENSES_LOADING });
//
//     // Used for building the indexedDB key and api call
//     const { wallet, createdAt } = expense;
//     const range = parseDateIntoMMYY(createdAt);
//     const indexDBKey = `expenses:${wallet}:${range}`;
//
//     // First encrypt the expense data
//     return createEncryptedSnapshot(expense)
//       .then(encryptedData => {
//
//         // server expects an object with a "range" property that describes the
//         // month and year of the expense, in the following format: MMYY.
//         const payload = {
//           range: range,
//           data: encryptedData
//         };
//
//         // The "expense" argument contains the matching walletId it belongs to
//         return api.post(`/expense/${wallet}`, payload);
//       })
//       .then(async response => {
//         // With the ID confirmation form the server, we can update local state
//         const expenseId = response.data;
//         const newExpense = { id: response.data, ...expense };
//
//         // Update local storage (indexedDB) if there's an entry for the expense's mmyy
//         const haveEntry = await get(indexDBKey);
//         if (haveEntry) {
//           await update(indexDBKey, expenses => [...expenses, newExpense]);
//         }
//
//         dispatch(addExpense(newExpense));
//         dispatch(addMessage('Expense created successfully.'));
//         dispatch({ type: actions.STOP_EXPENSES_LOADING });
//         return true; // Signals component to redirect to expense page
//       })
//       .catch(err => {
//         const message = err.response ? err.response.data : err.message;
//         dispatch(addError(message));
//         dispatch({ type: actions.STOP_EXPENSES_LOADING });
//         return false; // Signals component not to redirect
//       });
//   };
// };

export const startUpdateExpense = ({
  id,
  previousCreatedAt,
  createdAt,
  title,
  amount,
  description,
  category,
  wallet
}) => {
  return async dispatch => {
    try {
      dispatch({ type: actions.START_EXPENSES_LOADING });

      const encryptedData = await createEncryptedSnapshot(
        { createdAt, title, amount, description, category }
      );

      const payload = {
        data: encryptedData
      };

      // If the createdAt (date) of the expense changed to a different month,
      // it has to be updated by sending a "ranges" property to the server
      // detailing the this update using the MMYY format:
      const prevRange = parseDateIntoMMYY(previousCreatedAt);
      const newRange = parseDateIntoMMYY(createdAt);
      const hasDateChange = prevRange !== newRange;

      if (hasDateChange) {
        // Send the new ranges to the server who will update the database
        payload['ranges'] = `${prevRange},${newRange}`;

        // Also update the local indexedDB to remove this expense from the previous db.
        await update(`expenses:${wallet}:${prevRange}`, expenses => {
          return expenses.filter(expense => expense.id !== id);
        });
      }
      // Send the updates to the server
      await api.put(`/expense/${id}`, payload);

      // Create an object with the new information for this expense
      const updatedExpense = { id, createdAt, title, amount, description, category, wallet };

      // Update local indexedDB with the new information (before we removed only if date changed)
      const range = parseDateIntoMMYY(createdAt);
      const indexDBKey = `expenses:${wallet}:${range}`;
      const currentEntry = await get(indexDBKey);

      // Note there may not be an existing entry for the new date in which case do nothing.
      if (currentEntry) {
        update(indexDBKey, expenses => expenses.map(expense => {
          return expense.id === id ? updatedExpense : expense;
        })).then(console.log).catch(console.error)
      }

      // And finnaly, update redux state
      dispatch(updateExpense(updatedExpense));
      dispatch(addMessage('Expense updated successfully.'));
      return true; // Signals component to redirect to expense page

    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
      return false; // Signals component not to redirect
    } finally {
      dispatch({ type: actions.STOP_EXPENSES_LOADING });
    }
  };
};

// export const startUpdateExpense = ({
//   id,
//   previousCreatedAt,
//   createdAt,
//   title,
//   amount,
//   description,
//   category,
//   wallet
// }) => {
//   return dispatch => {
//
//     dispatch({ type: actions.START_EXPENSES_LOADING });
//
//     return createEncryptedSnapshot({ createdAt, title, amount, description, category })
//       .then(async encryptedData => {
//
//         const payload = {
//           data: encryptedData
//         };
//
//         // If the createdAt (date) of the expense changed to a different month,
//         // it has to be updated by sending a "ranges" property to the server
//         // detailing the this update using the MMYY format:
//         const prevRange = parseDateIntoMMYY(previousCreatedAt);
//         const newRange = parseDateIntoMMYY(createdAt);
//
//         // If they are different then send the update to the server and update local storage
//         if (prevRange !== newRange) {
//           payload['ranges'] = `${prevRange},${newRange}`;
//           await update(`expenses:${wallet}:${prevRange}`, expenses => {
//             return expenses.filter(expense => expense.id !== id);
//           });
//         }
//
//         await api.put(`/expense/${id}`, payload);
//
//         const updatedExpense = { id, createdAt, title, amount, description, category, wallet };
//
//         // The data of the expense is used to update local storage unless there's no entry for it yet.
//         const range = parseDateIntoMMYY(createdAt);
//         const indexDBKey = `expenses:${wallet}:${range}`;
//         const haveEntry = await get(indexDBKey);
//         if (haveEntry) {
//           await update(indexDBKey, expenses => {
//             return expenses.map(expense => expense.id === id ? updatedExpense : expense)
//           });
//         }
//
//         dispatch(updateExpense(updatedExpense));
//         dispatch(addMessage('Expense updated successfully.'));
//         dispatch({ type: actions.STOP_EXPENSES_LOADING });
//         return true; // Signals component to redirect to expense page
//       })
//       .catch(err => {
//         const message = err.response ? err.response.data : err.message;
//         dispatch(addError(message));
//         dispatch({ type: actions.STOP_EXPENSES_LOADING });
//         return false; // Signals component not to redirect
//       });
//   };
// };

export const startRemoveExpense = (expenseId = '') => {
  return (dispatch, getState) => {
    dispatch({ type: actions.START_EXPENSES_LOADING });

    const state = getState();
    const indexDBKey = generateIndexDBKey(state, 'expenses');

    return api.delete(`/expense/${expenseId}`)
      .then(async () => {

        await update(indexDBKey, expenses => {
          return expenses.filter(expense => expense.id !== expenseId);
        });

        dispatch(removeExpense(expenseId));
        dispatch(addMessage('Expense deleted successfully.'));
        dispatch({ type: actions.STOP_EXPENSES_LOADING });
      })
      .catch(err => {
        const message = err.response ? err.response.data : err.message;
        dispatch(addError(message));
        dispatch({ type: actions.STOP_EXPENSES_LOADING });
      });
  };
};
