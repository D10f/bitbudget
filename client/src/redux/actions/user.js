// import axios from 'axios';
import api from '../../utils/api';
import { del, clear } from 'idb-keyval';
import userActionTypes as actions from '../actionTypes';
import { setWallets } from './wallet';
import { setExpenses } from './expenses';
import { setCategories } from './categories';
import { setTheme, setPrimaryColor } from './theme';
import { addError } from './notifications';
import { generateCryptoKey } from '../../utils/crypto';
import { createUserSnapshot, restoreUserSnapshot, createSnapshot, restoreSnapshot } from '../../utils/snapshot';

export const setUser = (user = {}) => ({
  type: actions.SET_USER,
  payload: user
});

export const startSignupUser = (credentials = {}) => {
  return (dispatch, getState) => {
    // const endpoint = 'http://localhost:5000/user/signup';
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // };

    return api.post('/user/signup', credentials)
      .then(async res => {
        const { user, token, walletId } = res.data;
        user.token = token;

        const firstWallet = {
          id: walletId,
          name: 'My First Wallet',
          budget: 0,
          currency: '$',
          isCurrent: true
        };

        // Update local state
        dispatch(setUser(user));
        dispatch(setWallets([firstWallet]));

        // Generate an encryption key
        await generateCryptoKey(credentials.password);

        // Make an initial encrypted snapshot
        const { categories, theme, wallets } = getState();

        const userData = {
          endpoint: 'PUT /user/update',
          payload: {
            categories,
            theme,
            wallets
          }
        };

        createSnapshot(userData)
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

export const startLoginUser = (credentials = {}) => {
  return (dispatch, getState) => {
    // const endpoint = 'http://localhost:5000/user/login';
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // };

    return axios.post('/user/login', credentials)
      .then(res => {
        const { user, token } = res.data;
        const userObject = {
          username: user.username,
          email: user.email || '',
          token,
          data: user.data
        };

        // Fetched user data and updating Redux state
        dispatch(setUser(userObject));
        return true; // signals component to prompt for encryption password
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch(addError(err.response.data));
        return false; // signals component not to prompt for encryption password
      });
  };
};

export const startRestoreUserData = (encryptionPassword) => {
  return (dispatch, getState) => {

    const { user } = getState();
    return generateCryptoKey(encryptionPassword)
      .then(() => restoreSnapshot(user.data))
      .then(data => {
        delete user.data;
        dispatch(setUser(user));
        dispatch(setWallets(data.wallets));
        dispatch(setCategories(data.categories));
        dispatch(setTheme(data.theme.theme));
        dispatch(setPrimaryColor(data.theme.primary));
        return true; // signals component to redirect to dashboard
      })
      .catch(err => {
        console.error(err.message);
        dispatch(addError(err.message));
        // remove generated key??
        return false; // signals component not to redirect
      })
  }
};

export const logoutUser = () => ({
  type: actions.LOGOUT_USER
});

export const startLogoutUser = () => {
  return (dispatch, getState) => {
    const { user } = getState();
    // const endpoint = 'http://localhost:5000/user/logout';
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${user.token}`
    //   }
    // };

    return api.get('/user/logout')
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
  type: actions.UPDATE_USER,
  payload: updates
})

export const startUpdateUser = (updates) => {
  return (dispatch, getState) => {

    const currentState = getState();
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${currentState.user.token}`
    //   }
    // };

    return api.put('/user/update', updates)
      .then(console.log)
      .catch(err => {
        console.error(err.response.data);
        dispatch(addError(err.response.data));
      })
  };
};
