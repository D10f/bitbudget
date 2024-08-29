import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    user: unknown | null;
    token: string | null;
};

const initialState: AuthState = {
    token: null,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },

        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;
