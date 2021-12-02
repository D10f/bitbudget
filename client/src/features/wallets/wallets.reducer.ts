import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const mockWallets = [
  {
    id: "123",
    name: "Malta",
    budget: "123",
    currency: "EUR",
    isCurrent: true,
  },
  {
    id: "abc",
    name: "Iceland",
    budget: "123",
    currency: "EUR",
    isCurrent: false,
  },
];

enum WalletLoadingStates {
  IDLE,
  LOADING,
}

interface IWalletState {
  wallets: IWallet[];
  loading: WalletLoadingStates;
}

const initialState: IWalletState = {
  wallets: mockWallets,
  loading: WalletLoadingStates.IDLE,
};

export const walletsReducer = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<IWallet>) => {
      state.wallets.push(action.payload);
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter(
        (wallet) => wallet.id !== action.payload
      );
    },
    updateWallet: (state, action: PayloadAction<IWallet>) => {
      state.wallets = state.wallets.map((wallet) =>
        wallet.id === action.payload.id ? action.payload : wallet
      );
    },
    deleteWallet: (state, action: PayloadAction<IWallet>) => {
      const updatedWalletList = state.wallets.filter(
        (wallet) => wallet.id !== action.payload.id
      );

      if (action.payload.isCurrent) {
        updatedWalletList[0].isCurrent = true;
      }

      state.wallets = updatedWalletList;
    },
    selectWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.map((wallet) =>
        wallet.id === action.payload
          ? { ...wallet, isCurrent: true }
          : { ...wallet, isCurrent: false }
      );
    },
  },
});

export const {
  addWallet,
  removeWallet,
  updateWallet,
  selectWallet,
  deleteWallet,
} = walletsReducer.actions;
export default walletsReducer.reducer;
