import axios from 'axios';
import moment from 'moment';
import { addMessage, addError } from './notifications';
import { objectToBuffer, createSnapshot, restoreSnapshot } from '../../utils/snapshot';
import { encryptData } from '../../utils/crypto';
import { uploadImage, removeImage } from '../../utils/imageHandler';
import { updateQueries, startUpdateQueries, getQueriesForRanges } from './queries';
import {
  ADD_EXPENSE,
  REMOVE_EXPENSE,
  REMOVE_EXPENSE_IMAGE,
  UPDATE_EXPENSE,
  UPDATE_EXPENSE_IMAGE,
  SET_EXPENSES
} from '../actionTypes';

// TODO: Clean up fetchExpenses function!!!!

/**
* Retrieves expenses for the wallet and time ranges provided
* @param  {string} walletId The wallet id to look into
* @param  {array}  ranges   Array of ranges formatted as MMYY to look into
* @return {array}           Array of expenses found on the specified ranges
*/
export const fetchExpenses = (walletId = '', ranges = []) => {
  return (dispatch, getState) => {

    if (ranges.length === 0) throw new Error('You must define a search range');

    const { user, expenses, queries } = getState();
    const existingQueries = [];
    const newQueries = [];

    // Store each request made using key:value pairs just like Redis does. Here
    // we check for previous requests before making the network request
    ranges.forEach(range => queries[`${walletId}${range}`]
      ? existingQueries.push(`${walletId}${range}`)
      : newQueries.push(range)
    );

    // If there are no new queries needed we can return the cached ones instead
    if (newQueries.length === 0) {
      const expenseList = getQueriesForRanges(queries, existingQueries);
      return dispatch(setExpenses(expenseList));
    }

    // Parses the ranges array into a query string e.g.,: ?0=0621&1=0222&2=1221
    const queryString = newQueries.reduce((acc, val, idx) => {
      return `${acc}${idx}=${val}&`;
    }, '?');

    const endpoint = `http://localhost:5000/wallet/s/${walletId}${queryString}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    };

    return axios.get(endpoint, config)
      .then(response => {

        // Based on the response data, we'll combine this object to update our
        // exisitng "queries" cache state.
        const updatedQueries = {};
        newQueries.forEach(range => {
          updatedQueries[`${walletId}${range}`] = [];
        });

        // Decrypt the expenses and assign them to the "updatedQueries" object
        // based on their "range" property.
        response.data.forEach(async expense => {
          expense.data = await restoreSnapshot(expense.data);
          const queryKey = `${walletId}${expense.data.range}`;
          updatedQueries[queryKey].push(expense);
        });

        const combinedQueryList = [
          ...Object.keys(updatedQueries),
          ...existingQueries
        ];

        console.log(updatedQueries);

        // Update the existing queries
        // dispatch(updateQueries(updatedQueries));
        // const expenseList = getQueriesForRanges(queries, combinedQueryList);
        // dispatch(setExpenses(expenseList));
      })
      .catch(err => {
        if (err.response) {
          console.error(err.response.data);
          dispatch(addError(err.response.data));
        } else {
          console.error(err.message);
          dispatch(addError(err.message));
        }
        return []; // return empty array
      });
  };
};

export const addExpense = (expense = {}) => ({
  type: ADD_EXPENSE,
  payload: expense
});

export const startAddExpense = (expense = {}) => {
  return (dispatch, getState) => {

    const { user } = getState();
    // const endpoint = `http://localhost:5000/expense/${expense.wallet}`;
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${user.token}`
    //   }
    // };

    // server expects an object with a "range" property that describes the
    // month and year of the expense, in the following format: MMYY.
    const month = moment(expense.createdAt).month().toString();
    const year = moment(expense.createdAt).year().toString();
    const range = `${month.padStart(2, '0')}` + `${year.slice(2)}`;
    expense.range = range;

    // Convert the JavaScript object into an arrayBuffer, encrypt and upload it
    // return objectToBuffer(expense)
    //   .then(encryptData)
    //   .then(encryptedExpense => {
    //
    //     const payload = {
    //       data: btoa(encryptedExpense),
    //       range
    //     };
    //
    //     return axios.post(endpoint, payload, config)
    //   })

    const expenseData = {
      endpoint: `POST http://localhost:5000/expense/${expense.wallet}`,
      token: user.token,
      payload: expense,
      options: {
        range
      }
    };

    return createSnapshot(expenseData)
      .then(response => {
        dispatch(addExpense({ _id: response.data, ...expense }));
        dispatch(addMessage('Expense created successfully.'));
        return true; // Signals component to redirect to expense page
      })
      .catch(res => {
        console.error(res.response.data);
        dispatch(addError(res.response.data));
        return false; // Signals component not to redirect
      });
  };
};

export const removeExpense = (expenseId) => ({
  type: REMOVE_EXPENSE,
  payload: expenseId
});

export const startRemoveExpense = (expenseId = '') => {
  return (dispatch, getState) => {
    const state = getState();
    const endpoint = `http://localhost:5000/expense/${expenseId}`;
    const config = {
      headers: {
        Authorization: `Bearer ${state.user.token}`
      }
    };

    return axios.delete(endpoint, config)
      .then(() => {
        dispatch(removeExpense(expenseId));
        dispatch(addMessage('Expense deleted successfully.'));
      })
      .catch(res => {
        console.error(res.response.data);
        dispatch(addError(res.response.data));
      });
  };
};

// export const startRemoveExpense = (expenseId) => {
//   return (dispatch, getState) => {
//
//     const { imageUrl } = getState()
//       .expenses.find(expense => expense._id === expenseId);
//
//     dispatch(removeExpense(expenseId));
//     dispatch(addMessage('Expense deleted successfully.'))
//     const currentState = getState();
//
//     // If expense had an image attached, delete is as well
//     if (imageUrl) {
//       removeImage(imageUrl, currentState.user.token);
//     }
//
//     return createSnapshot(currentState)
//       .catch(err => {
//         console.error(err);
//         dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
//       });
//   };
// }

export const removeExpenseImage = (id = '') => ({
  type: REMOVE_EXPENSE_IMAGE,
  payload: id
});

export const startRemoveExpenseImage = (id = '', url = '') => {
  return (dispatch, getState) => {
    dispatch(removeExpenseImage(id));
    dispatch(addMessage('Image removed successfuly'));
    const currentState = getState();
    removeImage(url, currentState.user.token)
      .then(console.log);
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const updateExpense = (expense = {}) => ({
  type: UPDATE_EXPENSE,
  payload: expense
});

export const startUpdateExpense = (expense = {}) => {
  return (dispatch, getState) => {
    const state = getState();
    const endpoint = `http://localhost:5000/expense/${expense._id}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.user.token}`
      }
    };

    return objectToBuffer(expense)
      .then(encryptData)
      .then(encryptedExpense => {

        // Same drill as with startAddExpense. Also, wallet is not a field that
        // can be selected on the frontend to update but it might in the future.
        const payload = {
          data: JSON.stringify(encryptedExpense),
          wallet: expense.wallet
        };

        return axios.put(endpoint, payload, config);
      })
      .then(response => {
        dispatch(updateExpense(expense));
        dispatch(addMessage('Expense updated successfully.'));
        return true; // Signals component to redirect to expense page
      })
      .catch(res => {
        console.error(res.response.data);
        dispatch(addError(res.response.data));
        return false; // Signals component not to redirect
      });
  };
};

export const updateExpenseImage = (id = '', url = '') => ({
  type: UPDATE_EXPENSE_IMAGE,
  payload: { id, url }
});

export const startUpdateExpenseImage = (file, id = '') => {
  return (dispatch, getState) => {
    const { token } = getState().user;
    return uploadImage(file, id, token)
      .then(url => {
        dispatch(updateExpenseImage(id, url));
        dispatch(addMessage('Image attached successfuly'));
        return url;
      })
      .then(url => {
        const currentState = getState();
        createSnapshot(currentState);
        return url;
      })
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const setExpenses = (expenses = []) => ({
  type: SET_EXPENSES,
  payload: expenses
});

// export const startSetExpenses = (authToken) => {
//   return (dispatch) => {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`
//       }
//     };
//
//     return axios.get('http://localhost:5000/expenses', config)
//       .then(({ data }) => dispatch(setExpenses(data)))
//       .catch(console.error);
//   };
// };
