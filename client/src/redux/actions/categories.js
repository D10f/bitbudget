import { SET_CATEGORIES, ADD_CATEGORY, REMOVE_CATEGORY } from '../actionTypes';

export const setCategories = (categories = []) => ({
  type: SET_CATEGORIES,
  payload: categories
})

export const addCategory = (category = '') => ({
  type: ADD_CATEGORY,
  payload: category
});

export const removeCategory = (category = '') => ({
  type: REMOVE_CATEGORY,
  payload: category
});
