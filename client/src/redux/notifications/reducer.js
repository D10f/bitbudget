import * as actions from './types';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  errors: [],
  messages: []
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {

    case actions.ADD_ERROR:
      return {
        ...state,
        errors: [
          ...state.errors,
          {
            type: 'error',
            id: uuidv4(),
            msg: action.payload.msg,
            duration: action.payload.duration
          }
        ]
      };

    case actions.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };

    case actions.ADD_MSG:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'message',
            id: uuidv4(),
            msg: action.payload.msg,
            duration: action.payload.duration
          }
        ]
      };

    case actions.REMOVE_MSG:
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload)
      };

    default:
      return state;
  }
};

export default errorReducer;
