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

export const setTextFilter = (text = '') => ({
  type: SET_TEXT_FILTER,
  text
});

export const setStartDate = (startDate) => ({
  type: SET_START_DATE,
  startDate
});

export const setEndDate = (endDate) => ({
  type: SET_END_DATE,
  endDate
});

export const switchSortOrder = () => ({
  type: SWITCH_SORT_ORDER
});

export const sortExpenses = (value) => {
  switch (value) {
    case 'amount':
      return {
        type: SORT_BY_AMOUNT
      };
    case 'createdAt':
      return {
        type: SORT_BY_DATE
      };
    case 'title':
      return {
        type: SORT_BY_TITLE
      };
    case 'category':
      return {
        type: SORT_BY_CATEGORY
      };
    default:
      return {
        type: SORT_BY_DATE
      };
  };
};
