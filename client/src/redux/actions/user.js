import axios from 'axios';
import { del, clear } from 'idb-keyval';
import { SET_USER, LOGOUT_USER, UPDATE_USER } from '../actionTypes';
import { setWallets } from './wallet';
import { setExpenses } from './expenses';
import { setCategories } from './categories';
import { setTheme, setPrimaryColor } from './theme';
import { addError } from './notifications';
import { v4 as uuidv4 } from 'uuid';
import { createSnapshot, restoreSnapshot } from '../../utils/snapshot';

export const setUser = (user = {}) => ({
  type: SET_USER,
  payload: user
});

export const startLoginUser = (credentials = {}) => {
  return (dispatch, getState) => {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.post('http://localhost:5000/login', credentials, config)
      .then(response => {
        const { user, token } = response.data;
        user.token = token;
        dispatch(setUser(user));
        return restoreSnapshot(user, credentials.password);
      })
      .then(store => {
        dispatch(setExpenses(store.expenses));
        dispatch(setWallets(store.wallets));
        dispatch(setCategories(store.categories));
        dispatch(setTheme(store.theme.theme));
        dispatch(setPrimaryColor(store.theme.primary));
        return true; // signals the component that can redirect to main screen
      })
      .catch(err => {
        // error coming from server middleware
        if (err.response) {
          dispatch(addError(err.response.data));
          return false; // signals the component not to redirect to main screen
        }

        // error coming from elsewhere e.g., network error, decryption failed...
        dispatch(addError(err.message));
        dispatch(setUser({}));
        dispatch(logoutUser());
      });
  };
};

export const startSignupUser = (credentials = {}) => {
  return (dispatch, getState) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.post('http://localhost:5000/signup', credentials, config)
      .then(response => {
        const { user, token } = response.data;
        user.token = token;
        dispatch(setUser(user))
        const currentState = getState();
        return createSnapshot(currentState, credentials.password);
      })
      .catch(error => {
        if (error.response.data) {
          dispatch(addError(error.response.data));
          return false; // signals the component not to redirect anywhere
        } else {
          dispatch(addError('Something went wrong, please check your connection or try again later'));
        }
      });
  };
};

export const logoutUser = () => ({
  type: LOGOUT_USER
});

export const startLogoutUser = () => {
  return (dispatch, getState) => {

    const { user } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    };

    // del('cryptoKey')
    clear();
    dispatch(logoutUser());
    dispatch(setExpenses([]));
    dispatch(
      setWallets([{
        id: uuidv4(),
        name: 'Default Wallet',
        budget: 0,
        currency: '$',
        isCurrent: true
      }])
    );

    return axios.get('http://localhost:5000/users/logout', config)
      .catch(console.error);
  };
};

export const updateUser = (updates = {}) => ({
  type: UPDATE_USER,
  payload: updates
})

export const startUpdateUser = (updates) => {
  return (dispatch, getState) => {

    const currentState = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentState.user.token}`
      }
    };

    return axios.put('http://localhost:5000/user', updates, config)
      .then(user => {
        dispatch(updateUser({ updates }));
        return createSnapshot(currentState, updates.password); // snapshot with new password
      })
      .catch(console.error);
  };
};
