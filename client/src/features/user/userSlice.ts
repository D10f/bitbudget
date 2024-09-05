import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserData, UserPrefs } from '@features/user/types';

const initialState: User = {
    data: { name: 'Guest', email: '' },
    prefs: {
        theme: 'default',
    },
    vault: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setEmail(state, action: PayloadAction<string>) {
            state.data.email = action.payload;
        },
        updateUserData(state, action: PayloadAction<Partial<UserData>>) {
            Object.assign(state.data, action.payload);
        },
        updateUserPrefs(state, action: PayloadAction<Partial<UserPrefs>>) {
            Object.assign(state.prefs, action.payload);
        },
        addKey(state, action: PayloadAction<CryptoKey>) {
            state.vault.push(action.payload);
        },
    },
});

export const { setEmail, updateUserData, addKey } = userSlice.actions;

export default userSlice.reducer;
