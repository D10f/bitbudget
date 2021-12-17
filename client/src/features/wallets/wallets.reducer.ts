import {
  createSlice,
  createDraftSafeSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const mockWallets = [
  {
    id: "123",
    name: "Malta",
    budget: "500",
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
    updateWallet: (state, action: PayloadAction<IWallet>) => {
      state.wallets = state.wallets.map((wallet) =>
        wallet.id === action.payload.id ? action.payload : wallet
      );
    },
    deleteWallet: (state, action: PayloadAction<IWallet>) => {
      const updatedWalletList = state.wallets.filter(
        (wallet) => wallet.id !== action.payload.id
      );

      if (updatedWalletList.length && action.payload.isCurrent) {
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

export const { addWallet, updateWallet, selectWallet, deleteWallet } =
  walletsReducer.actions;
export default walletsReducer.reducer;

// SELECTORS

const selectSelf = (state: RootState) => state;

const selectCurrentWallet = createDraftSafeSelector(
  selectSelf,
  (state: RootState) => state.wallets.wallets.find(wallet => wallet.isCurrent)
);

const selectTotalExpenseAmount = createDraftSafeSelector(
  selectCurrentWallet,
  (wallet: IWallet | undefined) => 0
);
