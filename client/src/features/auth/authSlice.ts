import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

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
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },

        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },

        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
