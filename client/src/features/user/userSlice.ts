import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../services/api/apiService";
import SnapshotService from "../../services/snapshot/snapshotService";
import SessionStorageService from "../../services/sessionStorage/sessionStorageService";

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
    const response = await Api.post("/auth/signup", credentials);
    SessionStorageService.set("token", response.data.accessToken);
    await SnapshotService.generateCryptoKey(credentials.password);
    return {
      user: { id: response.data.id, username: credentials.username, email: credentials.email || "" },
      token: response.data,
    };
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: AuthUserPDO, { dispatch}) => {
    const response = await Api.post("/auth/signin", credentials);
    SessionStorageService.set("token", response.data.accessToken);
    await SnapshotService.generateCryptoKey(credentials.password);
    if (response.data.userData) {
      const userData = await SnapshotService.decryptSnapshot(response.data.userData);
      dispatch(setUserData(userData));
    }
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    logout: (state) => {
      SessionStorageService.clear();
      SnapshotService.deleteCryptoKey();
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
        state.data = "";
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        throw new Error(action.error.message);
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUserData, logout } = userSlice.actions;
export default userSlice.reducer;
