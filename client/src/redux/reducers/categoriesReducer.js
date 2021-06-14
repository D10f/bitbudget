import { SET_CATEGORIES, ADD_CATEGORY, REMOVE_CATEGORY } from '../actionTypes';

const initialState = [
  'Travel',
  'Entertainment',
  'Transport',
  'Grocieries',
  'Food',
  'Tickets',
  'Electronics',
  'Home',
  'Income',
  'Other'
];

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return action.payload;
    case ADD_CATEGORY:
      return [
        ...state,
        action.payload
      ];
    case REMOVE_CATEGORY:
      return state.filter(category => category !== action.payload);
    default:
      return state;
  }
};

export default expenseReducer;
