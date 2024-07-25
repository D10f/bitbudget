import {
    createAsyncThunk,
    createSlice,
    isFulfilled,
    isPending,
    PayloadAction,
} from '@reduxjs/toolkit';

type AuthState = {
    token: string | null;
    loading: boolean;
};

type AuthCredentials = {
    username: string;
    email: string;
    password: string;
};

const initialState: AuthState = {
    token: null,
    loading: false,
};

export const signupUser = createAsyncThunk(
    'auth/signup',
    async function (credentials: AuthCredentials) {
        const res = await fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await res.json();

        console.log(data);
    },
);

export const loginUser = createAsyncThunk('auth/login', function () {
    return new Promise<number>((resolve) => {
        setTimeout(() => resolve(Math.floor(Math.random() * 100) + 1), 1000);
    });
});

export const logoutUser = createAsyncThunk('auth/logout', function () {
    return new Promise<number>((resolve) => {
        resolve(2);
    });
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.fulfilled, () => {
                console.log('sdf');
            })
            .addMatcher(isPending, (state) => {
                state.loading = true;
            })
            .addMatcher(isFulfilled, (state) => {
                state.loading = false;
            });
    },
});

export const { setToken } = authSlice.actions;

export default authSlice.reducer;
