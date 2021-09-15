// import moment from 'moment';
import api from '../../utils/api';
import * as actions from './types';
import { addMessage, addError } from '../notifications/actions';
import { createEncryptedSnapshot, restoreSnapshot } from '../../utils/snapshot';

export const addWallet = (wallet = {}) => ({
  type: actions.ADD_WALLET,
  payload: wallet
});

export const removeWallet = (walletId) => ({
  type: actions.REMOVE_WALLET,
  payload: walletId
});

export const updateWallet = (wallet = {}) => ({
  type: actions.UPDATE_WALLET,
  payload: wallet
});

export const setCurrentWallet = (id) => ({
  type: actions.SET_CURRENT_WALLET,
  payload: id
});

export const setWallets = (wallets = {}) => ({
  type: actions.SET_WALLETS,
  payload: wallets
});

export const startAddWallet = wallet => {
  return (dispatch, getState) => {

    dispatch({ type: actions.SET_WALLET_LOADING });

    // Registers a new wallet in the server, retrives its ID
    return api.post('/wallet', wallet)
      .then(response => {

        // Update local state with new wallet and ID
        dispatch(addWallet({
          id: response.data._id,
          isCurrent: false,
          ...wallet
        }));

        // Update encrypted data on the user object
        const { categories, theme, wallets } = getState();
        return createEncryptedSnapshot({ categories, theme, wallets });
      })
      .then(encryptedData => api.put('/user/update', { data: encryptedData }))
      .then(() => {
        dispatch({ type: actions.STOP_WALLET_LOADING });
        dispatch(addMessage('Wallet created successfully.'));
      })
      .catch(error => {
        const message = error.response ? error.response.data : error.message;
        console.error(message);
        dispatch({ type: actions.STOP_WALLET_LOADING });
        dispatch(addError(error.response.data));
      });
  };
};

export const startUpdateWallet = wallet => {
  return (dispatch, getState) => {

    dispatch({ type: actions.SET_WALLET_LOADING });
    dispatch(updateWallet(wallet));

    const { categories, theme, wallets } = getState();
    return createEncryptedSnapshot({ categories, theme, wallets })
      .then(encryptedData => api.put('/user/update', { data: encryptedData }))
      .then(() => {
        dispatch({ type: actions.STOP_WALLET_LOADING });
        dispatch(addMessage('Wallet updated successfully.'));
      })
      .catch(error => {
        const message = (error.response.data || {}).message;
        console.error(message);
        dispatch({ type: actions.STOP_WALLET_LOADING });
        dispatch(addError(error.response.data));
      });
  };
};

export const startRemoveWallet = id => {
  return (dispatch, getState) => {

    dispatch({ type: actions.SET_WALLET_LOADING });

    return api.delete(`/wallet/${id}`)
      .then(() => {
        dispatch(removeWallet(id));
        const { categories, theme, wallets } = getState();
        return createEncryptedSnapshot({ categories, theme, wallets });
      })
      .then(encryptedData => api.put('/user/update', { data: encryptedData }))
      .then(() => {
        dispatch({ type: actions.STOP_WALLET_LOADING });
        dispatch(addMessage('Wallet updated successfully.'));
      })
      .catch(error => {
        const message = (error.response.data || {}).message;
        console.error(message);
        dispatch({ type: actions.STOP_WALLET_LOADING });
        dispatch(addError(error.response.data));
      });
  };
};
