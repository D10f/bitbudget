import {
  createSlice,
  createAsyncThunk,
  ThunkAction,
  AnyAction,
  PayloadAction,
} from "@reduxjs/toolkit";
import Api from "../../services/api/apiService";
import SnapshotService from "../../services/snapshot/snapshotService";
import SessionStorageService from "../../services/sessionStorage/sessionStorageService";
import { addWallet, setWallets } from "../wallets/walletsSlice";
import { setCategories } from "../categories/categoriesSlice";
import { RootState } from "../../app/store";
import { addNotification } from "../notifications/notificationsSlice";

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

// export const signupUser = createAsyncThunk(
//   "user/signup",
//   async (credentials: AuthUserPDO, { dispatch, getState }) => {
//     const response = await Api.post("/auth/signup", credentials);

//     // Setup initial default wallet
//     dispatch(addWallet({
//       id: response.data.defaultWalletId,
//       name: "Default Wallet",
//       budget: "1000",
//       currency: "EUR",
//       isCurrent: true,
//     }));

//     SessionStorageService.set("token", response.data.accessToken);
//     await SnapshotService.generateCryptoKey(credentials.password);
//     const state = getState() as RootState;
//     await SnapshotService.createEncryptedSnapshot(state);
//     return {
//       user: { id: response.data.id, username: response.data.username, email: response.data.email },
//       token: response.data.accessToken,
//     };
//   }
// );

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: AuthUserPDO, { dispatch }) => {
    const response = await Api.post("/auth/signin", credentials);
    SessionStorageService.set("token", response.data.accessToken);
    await SnapshotService.generateCryptoKey(credentials.password);
    const userData = await Api.get(`/users/${response.data.id}`, {
      responseType: "raw",
    });
    const decryptedData = await SnapshotService.decryptSnapshot(userData.data);
    console.log(decryptedData);
    dispatch(setWallets(decryptedData.wallets));
    dispatch(setCategories(decryptedData.categories));
    return {
      user: {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
      },
      token: response.data.accessToken,
    };
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: () => {
      SessionStorageService.clear();
      SnapshotService.deleteCryptoKey();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log(action.error.message);
        state.loading = false;
      });
  },
});

export const { setUserData, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;
