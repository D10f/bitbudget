import { baseApi } from '@app/api/base';
import { setToken, setUser } from '@features/auth/authSlice';
import { HTTP_METHOD } from '../../types/http';
import { generateMasterKey } from '../../services/keys';
import type { AuthResponse, Credentials } from '@features/auth/types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<AuthResponse, Credentials>({
            queryFn: async (credentials, api, _extra, baseQuery) => {
                try {
                    const masterKey = await generateMasterKey(
                        credentials.name,
                        credentials.password,
                    );

                    const res = await baseQuery({
                        url: '/auth/signup',
                        method: HTTP_METHOD.POST,
                        body: {
                            ...credentials,
                            password: masterKey.hash,
                        },
                    });

                    const data = res.data as AuthResponse;

                    api.dispatch(setToken(data.accessToken));
                    api.dispatch(setUser(data.user));
                    return { data };
                } catch (error) {
                    return { error };
                }
            },
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
