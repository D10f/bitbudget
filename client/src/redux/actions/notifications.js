import { ADD_ERROR, REMOVE_ERROR, ADD_MSG, REMOVE_MSG } from '../actionTypes';
import { v4 as uuidv4 } from 'uuid';

export const addError = (error = '', duration = 5000) => ({
  type: ADD_ERROR,
  payload: {
    type: 'error',
    id: uuidv4(),
    msg: error,
    duration
  }
});

export const addMessage = (msg = '', duration = 5000) => ({
  type: ADD_MSG,
  payload: {
    type: 'message',
    id: uuidv4(),
    msg,
    duration
  }
});

export const removeError = (id = '') => ({
  type: REMOVE_ERROR,
  payload: id
});

export const removeMessage = (id = '') => ({
  type: REMOVE_MSG,
  payload: id
});
