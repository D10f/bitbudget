import * as actions from './types';

const initialState = {
  theme: 'light'
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPDATE_THEME:
      return {
        theme: action.payload
      };

    case actions.SET_THEME:
      return action.payload;

    default:
      return state;
  }
};

export default themeReducer;
