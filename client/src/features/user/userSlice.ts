import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPrefs } from '@features/user/types';
import { RootState } from '@app/store';

const initialState: User = {
    name: 'Guest',
    email: '',
    prefs: {
        theme: 'default',
    },
    vault: [null, null],
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
        addKey(state, action: PayloadAction<JsonWebKey>) {
            const emptyIdx = state.vault.findIndex((pos) => pos === null);
            if (emptyIdx < 0) {
                throw new Error('Unable to add more keys to vault!');
            }
            state.vault[emptyIdx] = action.payload;
        },
        resetKeys(state) {
            state.vault = initialState.vault;
        },
    },
});

export const { setUserData, setUserPrefs, addKey, resetKeys } =
    userSlice.actions;

export default userSlice.reducer;

export const selectUserPrefs = (state: RootState) => state.user.prefs;
