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

const initialState: IWallet[] = mockWallets;

export const walletsReducer = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<IWallet>) => {
      return [...state, action.payload];
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      return state.filter((wallet) => wallet.id !== action.payload);
    },
    updateWallet: (state, action: PayloadAction<IWallet>) => {
      return state.map((wallet) =>
        wallet.id === action.payload.id ? action.payload : wallet
      );
    },
    deleteWallet: (state, action: PayloadAction<IWallet>) => {
      const updatedWalletList = state.filter(
        (wallet) => wallet.id !== action.payload.id
      );
      if (action.payload.isCurrent) {
        return updatedWalletList.map((wallet, idx) =>
          idx === 0 ? { ...wallet, isCurrent: true } : wallet
        );
      }
      return updatedWalletList;
    },
    selectWallet: (state, action: PayloadAction<string>) => {
      return state.map((wallet) =>
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
