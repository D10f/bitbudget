import { del, clear } from 'idb-keyval';
import api from '../../utils/api';

import * as actions from './types';
import { addWallet, setWallets } from '../wallets/actions';
import { setExpenses } from '../expenses/actions';
import { setTheme } from '../theme/actions';
import { setCategories, resetCategories } from '../categories/actions';
import { addError, addMessage } from '../notifications/actions';
import { generateCryptoKey } from '../../utils/crypto';
import { createEncryptedSnapshot, restoreSnapshot } from '../../utils/snapshot';

export const setUser = (user = {}) => ({
  type: actions.SET_USER_SUCCESS,
  payload: user
});

export const updateUser = (updates = {}) => ({
  type: actions.UPDATE_USER_SUCCESS,
  payload: updates
});

export const logoutUser = () => ({
  type: actions.LOGOUT_USER
});

/**
 * Most actions return "true" on success and "false" on error cases.
 * This serves to signal back to the component who invoked the redux-thunk func
 * whether to redirect, re-render or perform soms other action.
 */

export const startSignupUser = (credentials = {}) => {
  return (dispatch, getState) => {

    dispatch({ type: actions.START_USER_LOADING });

    return api.post('/user/signup', credentials)
      .then(async response => {
        const { user, token, walletId } = response.data;
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
        dispatch(addWallet(firstWallet));

        // Generate an encryption key and make an initial encrypted snapshot
        await generateCryptoKey(credentials.password);
        const { categories, theme, wallets } = getState();
        const encryptedUserData = await createEncryptedSnapshot({ categories, theme, wallets });

        // Backend endpoint expects an object specifying the keys to update
        await api.put('/user/update', { data: encryptedUserData });
        dispatch({ type: actions.STOP_USER_LOADING });
        return true;
      })
      .catch(err => {
        console.error(err);
        dispatch({ type: actions.STOP_USER_LOADING });
        dispatch(addError(err.response.data));
        return false;
      });
  };
};

export const startLoginUser = (credentials = {}) => {
  return (dispatch) => {

    dispatch({ type: actions.START_USER_LOADING });

    return api.post('/user/login', credentials)
      .then(response => {
        const { user, token } = response.data;
        const userObject = {
          username: user.username,
          email: user.email || '', // email is optional so it may be empty
          token,
          data: user.data // unencrypted
        };

        // Fetched user data and updating Redux state
        dispatch(setUser(userObject));
        dispatch({ type: actions.STOP_USER_LOADING });
        return true;
      })
      .catch(err => {
        const message = err.response ? err.response.data : err.message;
        dispatch({ type: actions.STOP_USER_LOADING });
        dispatch(addError(message));
        return false;
      });
  };
};

export const startRestoreUserData = (encryptionPassword) => {
  return (dispatch, getState) => {

    dispatch({ type: actions.START_USER_LOADING });
    const { user } = getState();

    return generateCryptoKey(encryptionPassword)
      .then(() => restoreSnapshot(user.data))
      .then(data => {
        delete user.data; // no need to keep the encrypted data around anymore
        dispatch(setUser(user));
        dispatch(setCategories(data.categories));
        dispatch(setTheme(data.theme));
        dispatch(setWallets(data.wallets));
        dispatch({ type: actions.STOP_USER_LOADING });
        // Fetch expenses for current month and wallet
        return true;
      })
      .catch(err => {
        console.error(err.message);
        dispatch({ type: actions.STOP_USER_LOADING });
        dispatch(addError(err.message));
        return false;
      })
  }
};

export const startLogoutUser = () => {
  return (dispatch, getState) => {
    const { user } = getState();

    clear();
    dispatch(setExpenses([]));
    dispatch(logoutUser());
      dispatch(setWallets({ isLoading: false, wallets: [] }));
    dispatch(resetCategories([]));
    dispatch(addMessage('Logged out successfully.'));
    dispatch({ type: actions.STOP_USER_LOADING });

    // Send a logout request to the server to remove the current token
    return api.get('/user/logout', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .catch(err => {
      console.error(err.response.data);
      dispatch(addError(err.response.data));
    });
  };
};

export const startUpdateUser = (updates) => {
  return (dispatch, getState) => {

    dispatch({ type: actions.START_USER_LOADING });

    // Remove empty values i.e., if password and/or email were not modified
    for (const option in updates) {
      if (
        updates[option] === '' ||
        updates[option] === undefined ||
        updates[option] === null
      ) {
        delete updates[option];
      }
    }

    // Encrypt the following user data
    const { categories, theme, wallets } = getState();
    return createEncryptedSnapshot({ categories, theme, wallets })
      .then(encryptedData => {
        updates.data = encryptedData;
        return api.put('/user/update', updates);
      })
      .then(() => {
        dispatch({ type: actions.STOP_USER_LOADING });
        dispatch(addMessage('User profile updated.'));
        return true;
      })
      .catch(err => {
        console.error(err.response.data);
        dispatch({ type: actions.STOP_USER_LOADING });
        dispatch(addError(err.response.data));
        return false;
      });
  };
};
