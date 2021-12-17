import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { del } from "idb-keyval";
import api from "../../services/api/apiService";
import {
  CRYPTO_INDEX_KEY,
  decryptData,
  generateCryptoKey,
} from "../../services/crypto/crypto";
import sessionStorageService from "../../services/sessionStorage/sessionStorageService";
import { addNotification } from "../notifications/notifications.reducer";

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
  async (credentials: AuthUserPDO) => {
    const response = await api.post("/auth/signup", credentials);
    sessionStorageService.set("token", response.data.accessToken);
    await generateCryptoKey(credentials.password);
    return {
      user: { username: credentials.username, email: "" },
      token: response.data,
    };
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: AuthUserPDO, thunkAPI) => {
    const response = await api.post("/auth/signin", credentials);
    sessionStorageService.set("token", response.data.accessToken);
    await generateCryptoKey(credentials.password);
    if (response.data.userData) {
      await decryptData(response.data.userData);
    }
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      sessionStorageService.clear();
      del(CRYPTO_INDEX_KEY);
      state = initialState;
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
        state.data = '';
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
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
