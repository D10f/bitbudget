import { baseApi } from '@app/api/base';
import { User } from '../../types/user';
import { HTTP_METHOD } from '../../types/http';

type AuthResponse = {
    user: User;
    accessToken: string;
};

type Credentials = {
    name: string;
    email: string;
    password: string;
};

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<AuthResponse, Credentials>({
            query: (credentials) => ({
                url: '/auth/signup',
                method: HTTP_METHOD.POST,
                body: credentials,
            }),
        }),
        login: builder.mutation<AuthResponse, Credentials>({
            query: (credentials: Credentials) => ({
                url: '/auth/login',
                method: HTTP_METHOD.POST,
                body: credentials,
            }),
            transformResponse: (response: AuthResponse) => {
                // decrypt user data before returning
                return response;
            },
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
