import * as actions from './types';

const initialState = {
  username: '',
  email: '',
  token: '',
  data: '',
  isAuthenticated: false,
  isLoading: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.START_USER_LOADING:
      return {
        ...state,
        isLoading: true
      };

    case actions.STOP_USER_LOADING:
      return {
        ...state,
        isLoading: false
      };

    case actions.SET_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true
      };

    case actions.SET_USER_ERROR:
      return {
        ...state,
        isLoading: false
      };

    case actions.UPDATE_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };

    case actions.LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;
