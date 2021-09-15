import * as actions from './types';

export const setCategories = (categories = []) => ({
  type: actions.SET_CATEGORIES,
  payload: categories
});

export const resetCategories = () => ({
  type: actions.RESET_CATEGORIES
});

export const addCategory = (category = '') => ({
  type: actions.ADD_CATEGORY,
  payload: category
});

export const removeCategory = (category = '') => ({
  type: actions.REMOVE_CATEGORY,
  payload: category
});
