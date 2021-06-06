import {
  ADD_EXPENSE,
  REMOVE_EXPENSE,
  UPDATE_EXPENSE,
  UPDATE_EXPENSE_IMAGE,
  SET_EXPENSES
} from '../actionTypes';
import { addMessage, addError } from './notifications';
import { createSnapshot } from '../../utils/snapshot';

export const addExpense = (expense = {}) => ({
  type: ADD_EXPENSE,
  payload: expense
});

export const startAddExpense = (expense = {}) => {
  return (dispatch, getState) => {
    dispatch(addExpense(expense));
    dispatch(addMessage('Expense created successfully.'));
    const currentState = getState();
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const removeExpense = (expenseId) => ({
  type: REMOVE_EXPENSE,
  payload: expenseId
});

export const startRemoveExpense = (expenseId) => {
  return (dispatch, getState) => {
    dispatch(removeExpense(expenseId));
    dispatch(addMessage('Expense deleted successfully.'))
    const currentState = getState();
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
}

export const updateExpense = (expense = {}) => ({
  type: UPDATE_EXPENSE,
  payload: expense
});

export const startUpdateExpense = (expense = {}) => {
  return (dispatch, getState) => {
    dispatch(updateExpense(expense));
    dispatch(addMessage('Expense updated successfully.'))
    const currentState = getState();
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const updateExpenseImage = (id = '', url = '') => ({
  type: UPDATE_EXPENSE_IMAGE,
  payload: { id, url }
});

export const startUpdateExpenseImage = (id = '', url = '') => {
  return (dispatch, getState) => {
    dispatch(updateExpenseImage(id, url));
    dispatch(addMessage('Image attached successfuly'));
    const currentState = getState();
    return createSnapshot(currentState)
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
