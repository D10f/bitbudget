import { SET_KEY } from '../actionTypes';

const initialState = null;

const keyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_KEY:
      return action.payload;
    default:
      return state;
  }
};

export default keyReducer;
