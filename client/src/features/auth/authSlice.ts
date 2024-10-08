import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@app/store';

type AuthState = {
    token: string | null;
};

const initialState: AuthState = {
    token: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },

        logout(state) {
            state.token = null;
        },
    },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.token;
