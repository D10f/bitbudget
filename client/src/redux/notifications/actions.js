import * as actions from './types';

export const addError = (msg = '', duration = 5000) => ({
  type: actions.ADD_ERROR,
  payload: {
    msg,
    duration
  }
});

export const addMessage = (msg = '', duration = 5000) => ({
  type: actions.ADD_MSG,
  payload: {
    msg,
    duration
  }
});

export const removeError = (id = '') => ({
  type: actions.REMOVE_ERROR,
  payload: id
});

export const removeMessage = (id = '') => ({
  type: actions.REMOVE_MSG,
  payload: id
});
