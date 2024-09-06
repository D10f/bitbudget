import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import userReducer from '@features/user/userSlice';
import { baseApi } from '@app/api/base';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
        user: userReducer,
    },
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware().concat(baseApi.middleware);
    },
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
