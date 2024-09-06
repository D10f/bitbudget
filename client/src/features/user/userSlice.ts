import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SymmetricKey, User, UserPrefs } from '@features/user/types';

const initialState: User = {
    name: 'Guest',
    email: '',
    prefs: {
        theme: 'default',
    },
    vault: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(
            state,
            action: PayloadAction<{ name: string; email?: string }>,
        ) {
            state.name = action.payload.name;
            state.email = action.payload.email ?? state.email;
        },
        setUserPrefs(state, action: PayloadAction<Partial<UserPrefs>>) {
            Object.assign(state.prefs, action.payload);
        },
        addKey(state, action: PayloadAction<SymmetricKey>) {
            state.vault.push(action.payload);
        },
    },
});

export const { setUserData, setUserPrefs, addKey } = userSlice.actions;

export default userSlice.reducer;
