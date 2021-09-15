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
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actions.START_USER_LOADING });

      const response = await api.post('/user/signup', credentials);
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
      return true;

    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
      return false;
    } finally {
      dispatch({ type: actions.STOP_USER_LOADING });
    }
  }
};

export const startLoginUser = (credentials = {}) => {
  return async dispatch => {
    try {
      dispatch({ type: actions.START_USER_LOADING });

      const response = await api.post('/user/login', credentials);
      const { user, token } = response.data;

      const userObject = {
        username: user.username,
        email: user.email || '', // email is optional so it may be empty
        token,
        data: user.data // unencrypted
      };

      // Fetched user data and updating Redux state
      dispatch(setUser(userObject));
      return true;

    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
      return false;
    } finally {
      dispatch({ type: actions.STOP_USER_LOADING });
    }
  };
};

export const startRestoreUserData = (encryptionPassword) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: actions.START_USER_LOADING });
      const { user } = getState();

      await generateCryptoKey(encryptionPassword);
      const data = await restoreSnapshot(user.data);

      delete user.data; // no need to keep the encrypted data around anymore

      dispatch(setUser(user));
      dispatch(setCategories(data.categories));
      dispatch(setTheme(data.theme));
      dispatch(setWallets(data.wallets));
      dispatch({ type: actions.STOP_USER_LOADING });
      return true;

    } catch (err) {

      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
      return false;

    } finally {
      dispatch({ type: actions.STOP_USER_LOADING });
    }
  }
};

export const startLogoutUser = () => {
  return async dispatch => {
    try {

      clear();
      dispatch(setExpenses([]));
      dispatch(logoutUser());
      dispatch(setWallets({ isLoading: false, wallets: [] }));
      dispatch(resetCategories([]));
      dispatch(addMessage('Logged out successfully.'));

      await api.get('/user/logout');
    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
    } finally {
      dispatch({ type: actions.STOP_USER_LOADING });
    }
  };
};

export const startUpdateUser = (updates) => {
  return async (dispatch, getState) => {
    try {
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

      const encryptedData = await createEncryptedSnapshot({ categories, theme, wallets })
      updates.data = encryptedData;

      await api.put('/user/update', updates);
      dispatch(addMessage('User profile updated.'));
      return true;

    } catch (err) {
      const message = err.response ? err.response.data : err.message;
      dispatch(addError(message));
    } finally {
      dispatch({ type: actions.STOP_USER_LOADING });
    }
  };
};
