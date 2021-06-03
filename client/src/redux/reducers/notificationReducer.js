import { ADD_ERROR, ADD_MSG, REMOVE_ERROR, REMOVE_MSG } from '../actionTypes';

const initialState = {
  errors: [],
  messages: []
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ERROR:
      return {
        ...state,
        errors: [
          ...state.errors,
          action.payload
        ]
      };
    case REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };
    case ADD_MSG:
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload
        ]
      };
    case REMOVE_MSG:
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload)
      };
    default:
      return state;
  }
};

export default errorReducer;
