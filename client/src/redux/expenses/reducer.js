import * as actions from './types';

const initialState = {
  expenses: [],
  isLoading: false
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_EXPENSE:
      return {
        ...state,
        expenses: [ ...state.expenses, action.payload ]
      };

    case actions.REMOVE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };

    case actions.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense => {
          return expense.id === action.payload.id ? action.payload : expense;
        })
      };

    case actions.SET_EXPENSES:
      return {
        isLoading: false,
        expenses: action.payload
      };

    case actions.START_EXPENSES_LOADING:
      return {
        ...state,
        isLoading: true
      };

    case actions.STOP_EXPENSES_LOADING:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
};

export default expenseReducer;
