import { SET_USER, LOGOUT_USER, UPDATE_USER } from '../actionTypes';

const initialState = {
  isAuthenticated: false,
  encryptionPassword: '',
  user: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        isAuthenticated: true,
        ...action.payload
      };
    case LOGOUT_USER:
      return {
        isAuthenticated: false,
        user: null
      };
    case UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }
    default:
      return state;
  }
};

export default userReducer;
