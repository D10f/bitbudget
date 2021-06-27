import axios from 'axios';
import { del, clear } from 'idb-keyval';
import { SET_USER, LOGOUT_USER, UPDATE_USER } from '../actionTypes';
import { setWallets } from './wallet';
import { setExpenses } from './expenses';
import { setCategories } from './categories';
import { setTheme, setPrimaryColor } from './theme';
import { addError } from './notifications';
import { v4 as uuidv4 } from 'uuid';
import { createUserSnapshot, restoreUserSnapshot, createSnapshot, restoreSnapshot } from '../../utils/snapshot';

export const setUser = (user = {}) => ({
  type: SET_USER,
  payload: user
});

export const startLoginUser = (credentials = {}) => {
  return (dispatch, getState) => {
    const endpoint = 'http://localhost:5000/user/login';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.post(endpoint, credentials, config)
      .then(res => {
        const { user, token } = res.data;
        const userObject = {
          username: user.username,
          email: user.email || '',
          token
        };

        // Fetched user data and updating Redux state
        dispatch(setUser(userObject));

        // Make another request for the encrypted data, using fetch this time as
        // it's actually much easier for handling ArrayBuffers (yes, even with
        // "responseType: arrayBuffer" option)
        const fetchConfig = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        return fetch('http://localhost:5000/user/settings', fetchConfig)
          .then(response => response.arrayBuffer())
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch(addError(err.response.data));
        return false; // signals component not to redirect
      });
  };
};

export const startRestoreUserSettings = (userSettings, decryptionPassword) => {
  return dispatch => {
    console.log(userSettings)
    console.log(userSettings.length)
    return restoreUserSnapshot(userSettings, decryptionPassword)
      .then(settings => {
        dispatch(setWallets(settings.wallets));
        dispatch(setCategories(settings.categories));
        dispatch(setTheme(settings.theme.theme));
        dispatch(setPrimaryColor(settings.theme.primary));
        return true; // signals component to redirect to dashboard
      })
      .catch(err => {
        console.error(err.message);
        dispatch(addError(err.message));
        return false; // signals component not to redirect
      })
  }
};

export const startSignupUser = (credentials = {}) => {
  return (dispatch, getState) => {
    const endpoint = 'http://localhost:5000/user/signup';
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };

    return axios.post(endpoint, credentials, config)
      .then(res => {
        const { user, token, walletId } = res.data;
        user.token = token;
        dispatch(setUser(user));

        const firstWallet = {
          id: walletId,
          name: 'My First Wallet',
          budget: 0,
          currency: '$',
          isCurrent: true
        };

        dispatch(setWallets([firstWallet]));

        // syncrhonize an encrypted snapshot
        const state = getState();

        createUserSnapshot(state, credentials.password)
          .catch(console.error);

        return true; // signals component to redirect to dashboard
      })
      .catch(err => {
        console.error(err.response.data);
        dispatch(addError(err.response.data));
        return false; // signals component not to redirect to dashboard
      });
  };
};

export const logoutUser = () => ({
  type: LOGOUT_USER
});

export const startLogoutUser = () => {
  return (dispatch, getState) => {
    const { user } = getState();
    const endpoint = 'http://localhost:5000/user/logout';
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    };

    return axios.get(endpoint, config)
      .then(() => {
        // del('cryptoKey')
        clear();
        dispatch(logoutUser());
        dispatch(setExpenses([]));
        dispatch(setWallets([]));
      })
      .catch(err => {
        console.error(err.response.data);
        dispatch(addError(err.response.data));
      });
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

    return axios.put('http://localhost:5000/user/update', updates, config)
      .then(res => {
        console.log(res);
      })

    // const user = await res.json();
    // dispatch(updateUser({ updates }));
    // return createSnapshot(currentState, updates.password); // snapshot with new password
    // .then(user => {})
    // .catch(console.error);


  };
};
