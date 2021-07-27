import * as actions from './types';

const initialState = [
  'Travel',
  'Entertainment',
  'Transport',
  'Groceries',
  'Food',
  'Tickets',
  'Electronics',
  'Home',
  'Income',
  'Other'
];

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_CATEGORIES:
      return action.payload;

    case actions.ADD_CATEGORY:
      return [
        ...state,
        action.payload
      ];

    case actions.REMOVE_CATEGORY:
      return state.filter(category => category !== action.payload);

    case actions.RESET_CATEGORIES:
      return initialState;

    default:
      return state;
  }
};

export default categoriesReducer;
