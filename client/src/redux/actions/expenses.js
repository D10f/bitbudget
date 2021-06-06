import {
  ADD_EXPENSE,
  REMOVE_EXPENSE,
  REMOVE_EXPENSE_IMAGE,
  UPDATE_EXPENSE,
  UPDATE_EXPENSE_IMAGE,
  SET_EXPENSES
} from '../actionTypes';
import { addMessage, addError } from './notifications';
import { createSnapshot } from '../../utils/snapshot';
import { uploadImage, removeImage } from '../../utils/imageHandler';

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

    const { imageUrl } = getState()
      .expenses.find(expense => expense._id === expenseId);

    dispatch(removeExpense(expenseId));
    dispatch(addMessage('Expense deleted successfully.'))
    const currentState = getState();

    // If expense had an image attached, delete is as well
    if (imageUrl) {
      removeImage(imageUrl, currentState.user.token);
    }

    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
}

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
