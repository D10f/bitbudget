import { createSelector } from 'reselect';

const selectWallets = state => state.wallets.wallets;

export const selectCurrentWallet = createSelector(
  [selectWallets],
  wallets => wallets.find(wallet => wallet.isCurrent)
);

export const selectCurrentWalletCurrency = createSelector(
  [selectCurrentWallet],
  wallet => wallet.currency
);

export const selectCurrentWalletBudget = createSelector(
  [selectCurrentWallet],
  wallet => wallet.budget
);
