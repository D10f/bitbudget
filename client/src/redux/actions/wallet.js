import { SET_WALLETS, ADD_WALLET, REMOVE_WALLET, UPDATE_WALLET, SET_CURRENT } from '../actionTypes';

export const setWallets = (wallets = []) => ({
  type: SET_WALLETS,
  payload: wallets
});

export const addWallet = (wallet = {}) => ({
  type: ADD_WALLET,
  payload: wallet
});

export const removeWallet = (walletId) => ({
  type: REMOVE_WALLET
});

export const updateWallet = (wallet = {}) => ({
  type: UPDATE_WALLET,
  payload: wallet
});

export const setCurrentWallet = (id) => ({
  type: SET_CURRENT,
  payload: id
})
