import {
  createSlice,
  createDraftSafeSelector,
  PayloadAction,
  AnyAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { RootState } from "../../app/store";
import Api from "../../services/api/apiService";
import SnapshotService from "../../services/snapshot/snapshotService";
import { addNotification } from "../notifications/notificationsSlice";

const defaultWallet = {
  id: uuid(),
  name: "Default Wallet",
  budget: "1000",
  currency: "EUR",
  isCurrent: true,
};

interface IWalletState {
  wallets: IWallet[];
  loading: boolean;
}

const initialState: IWalletState = {
  wallets: [],
  loading: false,
};

export const addWalletAsync =
  (
    walletData: IWallet
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    try {
      dispatch(walletLoading(true));
      dispatch(addWallet(walletData));
      // Syncrhonize with server and create encrypted snapshot of current state
      await Api.post("/wallets/", walletData);
      await SnapshotService.createEncryptedSnapshot(getState());
      dispatch(
        addNotification({ msg: "Wallet Added Successfully", type: "success" })
      );
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(walletLoading(false));
    }
  };

export const updateWalletAsync =
  (wallet: IWallet): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    try {
      dispatch(walletLoading(true));
      dispatch(updateWallet(wallet));
      // await Api.patch(`/wallets/${wallet.id}`, wallet);
      await SnapshotService.createEncryptedSnapshot(getState());
      dispatch(
        addNotification({ msg: "Wallet Updated Successfully", type: "success" })
      );
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(walletLoading(false));
    }
  };

export const deleteWalletAsync =
  (wallet: IWallet): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    try {
      const state = getState();

      if (state.wallets.wallets.length === 1) {
        throw new Error("You must have at least one wallet");
      }

      dispatch(walletLoading(true));
      dispatch(deleteWallet(wallet));
      await Api.delete(`/wallets/${wallet.id}`);
      await SnapshotService.createEncryptedSnapshot(state);
      dispatch(
        addNotification({
          msg: "Wallet Deleted Successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(walletLoading(false));
    }
  };

export const walletsReducer = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<IWallet[]>) => {
      state.wallets = action.payload;
    },
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
    walletLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setWallets,
  addWallet,
  updateWallet,
  selectWallet,
  deleteWallet,
  walletLoading,
} = walletsReducer.actions;
export default walletsReducer.reducer;

// SELECTORS

const selectSelf = (state: RootState) => state;

export const selectCurrentWallet = createDraftSafeSelector(
  selectSelf,
  (state: RootState) => state.wallets.wallets.find((wallet) => wallet.isCurrent)
);

export const selectTotalExpenseAmount = createDraftSafeSelector(
  selectCurrentWallet,
  (wallet: IWallet | undefined) => 0
);
