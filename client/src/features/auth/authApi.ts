import { baseApi } from '@app/api/base';
import { HTTP_METHOD } from '../../types/http';
import type {
    AuthSignupResponse,
    AuthLoginResponse,
    Credentials,
} from '@features/auth/types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<AuthSignupResponse, Credentials>({
            query: (credentials) => ({
                url: '/auth/signup',
                method: HTTP_METHOD.POST,
                body: credentials,
            }),
        }),
        login: builder.mutation<AuthLoginResponse, Credentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: HTTP_METHOD.POST,
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: HTTP_METHOD.POST,
            }),
        }),
    }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
    authApi;
