import {
  createSlice,
  ThunkAction,
  AnyAction,
  PayloadAction,
} from "@reduxjs/toolkit";
import Api from "../../services/api/apiService";
import SnapshotService from "../../services/snapshot/snapshotService";
import SessionStorageService from "../../services/sessionStorage/sessionStorageService";
import { addWallet, setWallets } from "../wallets/walletsSlice";
import { resetCategories, setCategories } from "../categories/categoriesSlice";
import { RootState } from "../../app/store";
import { addNotification } from "../notifications/notificationsSlice";
import { resetFilters } from "../filters/filtersSlice";
import { setExpenses } from "../expenses/expensesSlice";
import IndexDBStorage from "../../services/indexdbStorage/IndexDBStorage";

interface IUserState {
  user: IUser | null;
  data: string | null;
  token: string | null;
  loading: boolean;
}

const initialState: IUserState = {
  user: null,
  token: null,
  data: null,
  loading: false,
};

export const signupUser =
  (
    credentials: AuthUserPDO
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
      try {
        dispatch(setLoading(true));

        const response = await Api.post("/auth/signup", credentials);

        // setup default wallet
        dispatch(
          addWallet({
            id: response.data.defaultWalletId,
            name: "Default Wallet",
            budget: "1000",
            currency: "EUR",
            isCurrent: true,
          })
        );

        SessionStorageService.set("token", response.data.accessToken);
        await SnapshotService.generateCryptoKey(credentials.password);

        // update state with user data
        dispatch(
          setUserData({
            user: {
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
            },
            token: response.data.accessToken,
          })
        );

        await SnapshotService.createEncryptedSnapshot(getState());
        dispatch(
          addNotification({ msg: "Signup Successfully", type: "success" })
        );
      } catch (error) {
        dispatch(
          addNotification({ msg: (error as Error).message, type: "error" })
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

export const loginUser =
  (
    credentials: AuthUserPDO
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch) => {
      try {
        dispatch(setLoading(true));
        const response = await Api.post("/auth/signin", credentials);
        SessionStorageService.set("token", response.data.accessToken);
        await SnapshotService.generateCryptoKey(credentials.password);

        // Retrieve user data
        const userData = await Api.get(`/users/${response.data.id}`, {
          responseType: "raw",
        });

        // Decrypt user data
        const decryptedData = await SnapshotService.decryptSnapshot(
          userData.data
        );

        // Update user data
        dispatch(setWallets(decryptedData.wallets));
        dispatch(setCategories(decryptedData.categories));
        dispatch(
          setUserData({
            user: {
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
            },
            token: response.data.accessToken,
          })
        );
      } catch (error) {
        dispatch(
          addNotification({ msg: (error as Error).message, type: "error" })
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

export const logoutUser =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setUserData({ user: null, token: null }));
      dispatch(resetFilters());
      dispatch(resetCategories());
      dispatch(setExpenses([]));
      dispatch(setWallets([]));
      // SessionStorageService.clear();
      IndexDBStorage.clearAll();
      // SnapshotService.deleteCryptoKey();
      dispatch(
        addNotification({
          msg: "Logged out successuflly",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<Pick<IUserState, "user" | "token">>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;
