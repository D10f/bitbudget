import { ADD_EXPENSE, REMOVE_EXPENSE, UPDATE_EXPENSE, SET_EXPENSES } from '../actionTypes';

const initialState = [];

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPENSE:
      return [
        ...state,
        action.payload
      ];
    case REMOVE_EXPENSE:
      return state.filter(expense => expense._id !== action.payload._id);
    case UPDATE_EXPENSE:
      return state.map(expense => (expense._id === action.payload._id) ? action.payload : expense);
    case SET_EXPENSES:
      return action.payload;
    default:
      return state;
  }
};

export default expenseReducer;
