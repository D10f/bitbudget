import * as actions from './types';

// Completely overwrites current theme state
export const setTheme = (theme = {}) => ({
  type: actions.SET_THEME,
  payload: theme
});

// Switches current theme property in state
export const updateTheme = (theme = '') => ({
  type: actions.UPDATE_THEME,
  payload: theme
});
