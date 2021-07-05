import { createSelector } from 'reselect';

const selectWallets = state => state.wallets;

export const selectCurrentWallet = createSelector(
  [selectWallets],
  wallets => wallets.find(wallet => wallet.isCurrent)
);
