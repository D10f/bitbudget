import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../services/api/apiService";
import SnapshotService from "../../services/snapshot/snapshotService";
import SessionStorageService from "../../services/sessionStorage/sessionStorageService";
import { addWallet, setWallets } from "../wallets/walletsSlice";
import { setCategories } from "../categories/categoriesSlice";

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

export const signupUser = createAsyncThunk(
  "user/signup",
  async (credentials: AuthUserPDO, { dispatch }) => {
    const response = await Api.post("/auth/signup", credentials);

    // Setup initial default wallet
    dispatch(addWallet({
      id: response.data.defaultWalletId,
      name: "Default Wallet",
      budget: "1000",
      currency: "EUR",
      isCurrent: true,
    }));

    SessionStorageService.set("token", response.data.accessToken);
    await SnapshotService.generateCryptoKey(credentials.password);
    return {
      user: { id: response.data.id, username: response.data.username, email: response.data.email },
      token: response.data.accessToken,
    };
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: AuthUserPDO, { dispatch }) => {
    const response = await Api.post("/auth/signin", credentials);
    SessionStorageService.set("token", response.data.accessToken);
    await SnapshotService.generateCryptoKey(credentials.password);
    const userData = await Api.get(`/users/${response.data.id}`, { responseType: 'raw' });
    const decryptedData = await SnapshotService.decryptSnapshot(userData.data);
    dispatch(setWallets(decryptedData.wallets));
    dispatch(setCategories(decryptedData.categories));
    return {
      user: { id: response.data.id, username: response.data.username, email: response.data.email },
      token: response.data.accessToken,
    };
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    logout: () => {
      SessionStorageService.clear();
      SnapshotService.deleteCryptoKey();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        throw new Error(action.error.message);
      })

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
      })
  },
});

export const { setUserData, logout } = userSlice.actions;
export default userSlice.reducer;
