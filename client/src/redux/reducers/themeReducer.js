import { SET_THEME, SET_PRIMARY_COLOR } from '../actionTypes';

const initialState = {
  theme: 'light',
  primary: 'primary'
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    case SET_PRIMARY_COLOR:
      return {
        ...state,
        primary: action.payload
      }
    default:
      return state;
  }
};

export default themeReducer;
