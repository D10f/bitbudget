import {
  ADD_EXPENSE,
  REMOVE_EXPENSE,
  REMOVE_EXPENSE_IMAGE,
  UPDATE_EXPENSE,
  UPDATE_EXPENSE_IMAGE,
  SET_EXPENSES
} from '../actionTypes';

const initialState = [];

// TODO: Improve efficiency in updating/removing expenses
const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPENSE:
      return [
        ...state,
        action.payload
      ];
    case REMOVE_EXPENSE:
      return state.filter(expense => expense._id !== action.payload);
    case REMOVE_EXPENSE_IMAGE:
      return state.map(expense => expense._id !== action.payload
        ? expense
        : { ...expense, imageUrl: '' }
      );
    case UPDATE_EXPENSE:
      return state.map(expense => (expense._id === action.payload._id) ? action.payload : expense);
    case UPDATE_EXPENSE_IMAGE:
      return state.map(expense => expense._id !== action.payload.id
        ? expense
        : { ...expense, imageUrl: action.payload.url }
      );
    case SET_EXPENSES:
      return action.payload;
    default:
      return state;
  }
};

export default expenseReducer;
