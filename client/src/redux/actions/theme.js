import { SET_THEME, SET_PRIMARY_COLOR } from '../actionTypes';

export const setTheme = (theme = '') => ({
  type: SET_THEME,
  payload: theme
});

export const setPrimaryColor = (color = '') => ({
  type: SET_PRIMARY_COLOR,
  payload: color
});
