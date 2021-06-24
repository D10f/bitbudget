import {
  SET_TEXT_FILTER,
  SET_START_DATE,
  SET_END_DATE,
  SET_CURRENT_MONTH,
  SWITCH_SORT_ORDER,
  SORT_BY_DATE,
  SORT_BY_TITLE,
  SORT_BY_CATEGORY,
  SORT_BY_AMOUNT
} from '../actionTypes';

import moment from 'moment';

const initialState = {
  text: '',
  sortBy: 'date', // date or amount,
  sortDesc: true,
  startDate: moment().startOf('month'),
  endDate: moment().endOf('month'),
  currentMonth: {
    month: moment().month(),
    year: moment().year()
  }
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEXT_FILTER:
      return { ...state, text: action.payload };
    case SET_START_DATE:
      return { ...state, startDate: action.payload };
    case SET_END_DATE:
      return { ...state, endDate: action.payload };
    case SWITCH_SORT_ORDER:
      return { ...state, sortDesc: !state.sortDesc };
    case SET_CURRENT_MONTH:
      return { ...state, currentMonth: action.payload };
    case SORT_BY_AMOUNT:
      return { ...state, sortBy: 'amount' };
    case SORT_BY_DATE:
      return { ...state, sortBy: 'createdAt' };
    case SORT_BY_TITLE:
      return { ...state, sortBy: 'title' };
    case SORT_BY_CATEGORY:
      return { ...state, sortBy: 'category' };
    default:
      return state;
  };
};

export default filterReducer;
