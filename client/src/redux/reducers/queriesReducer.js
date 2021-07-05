import { ADD_QUERY, REMOVE_QUERY, UPDATE_QUERIES } from '../actionTypes';

const initialState = {};

const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUERY:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    case REMOVE_QUERY:
      delete state[action.payload];
      return state;
    case UPDATE_QUERIES:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
};

export default queryReducer;
