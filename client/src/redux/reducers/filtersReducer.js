import {
  SET_TEXT_FILTER,
  SET_START_DATE,
  SET_END_DATE,
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
  endDate: moment().endOf('month')
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEXT_FILTER:
      return { ...state, text: action.text };
    case SET_START_DATE:
      return { ...state, startDate: action.startDate };
    case SET_END_DATE:
      return { ...state, endDate: action.endDate };
    case SWITCH_SORT_ORDER:
      return { ...state, sortDesc: !state.sortDesc };
    case SORT_BY_AMOUNT:
      return { ...state, sortBy: 'amount' };
    case SORT_BY_DATE:
      return { ...state, sortBy: 'createdAt' };
    case SORT_BY_TITLE:
      return { ...state, sortBy: 'title' };
    case SORT_BY_CATEGORY :
      return { ...state, sortBy: 'category' };
    default:
      return state;
  };
};

export default filterReducer;
