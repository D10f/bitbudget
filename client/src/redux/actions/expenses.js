import { ADD_EXPENSE, REMOVE_EXPENSE, UPDATE_EXPENSE, SET_EXPENSES } from '../actionTypes';
import axios from 'axios';

export const addExpense = (expense = {}) => ({
  type: ADD_EXPENSE,
  payload: expense
});

// export const startAddExpense = (expense = {}, authToken) => {
//   return (dispatch) => {
//
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`
//       }
//     };
//
//     return axios.post('http://localhost:5000/expenses', expense, config)
//       .then(({ data }) => dispatch(addExpense(data)))
//       .catch(console.error);
//   };
// };

export const removeExpense = (expenseId) => ({
  type: REMOVE_EXPENSE
});

export const updateExpense = (expense = {}) => ({
  type: UPDATE_EXPENSE,
  payload: expense
});

// export const startUpdateExpense = (expense = {}, authToken) => {
//   return (dispatch) => {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`
//       }
//     };
//
//     const updates = {
//       title: expense.title,
//       description: expense.description,
//       amount: expense.amount,
//       createdAt: expense.createdAt,
//       location: expense.location
//     };
//
//     return axios.put(`http://localhost:5000/expenses/${expense._id}`, updates, config)
//       .then(({ data }) => dispatch(updateExpense(data)))
//       .catch(console.error);
//   };
// };

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
