import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import { baseApi } from '@app/api/base';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware().concat(baseApi.middleware);
    },
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
