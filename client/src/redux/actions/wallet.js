import {
  SET_WALLETS,
  ADD_WALLET,
  REMOVE_WALLET,
  UPDATE_WALLET,
  SET_CURRENT
} from '../actionTypes';
import { addMessage, addError } from './notifications';
import { createSnapshot } from '../../utils/snapshot';

export const setWallets = (wallets = []) => ({
  type: SET_WALLETS,
  payload: wallets
});

export const addWallet = (wallet = {}) => ({
  type: ADD_WALLET,
  payload: wallet
});

export const startAddCurrentWallet = (wallet = {}) => {
  return (dispatch, getState) => {
    dispatch(addWallet(wallet));
    dispatch(addMessage('New wallet created successfully.'));
    const currentState = getState();
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const removeWallet = (walletId) => ({
  type: REMOVE_WALLET
});

export const startRemoveWallet = (walletId) => {
  return (dispatch, getState) => {
    dispatch(removeWallet(walletId));
    dispatch(addMessage('Wallet deleted successfully.'))
    const currentState = getState();
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const updateWallet = (wallet = {}) => ({
  type: UPDATE_WALLET,
  payload: wallet
});

export const startUpdateWallet = (wallet = {}) => {
  return (dispatch, getState) => {
    dispatch(updateWallet(wallet));
    dispatch(addMessage('Wallet updated successfully.'))
    const currentState = getState();
    return createSnapshot(currentState)
      .catch(err => {
        console.error(err);
        dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
      });
  };
};

export const setCurrentWallet = (id) => ({
  type: SET_CURRENT,
  payload: id
})

// export const startSetCurrentWallet = (id) => {
//   return (dispatch, getState) => {
//     dispatch(setCurrentWallet(id));
//     const currentState = getState();
//     return createSnapshot(currentState)
//     .catch(err => {
//       console.error(err);
//       dispatch(addError('Error synchronizing data, please check your network connection and try again later.'));
//     });
//   };
// };
