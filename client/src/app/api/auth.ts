import { baseApi } from '@app/api/base';
import { setToken } from '@features/auth/authSlice';
import { HTTP_METHOD } from '../../types/http';
import { generateMasterKey } from '../../services/keys';
import { updateUserData, addKey } from '@features/user/userSlice';
import type { AuthResponse, Credentials } from '@features/auth/types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<AuthResponse, Credentials>({
            queryFn: async (
                { name, email, password },
                { dispatch },
                _extra,
                baseQuery,
            ) => {
                try {
                    const masterKey = await generateMasterKey(name, password);

                    const res = await baseQuery({
                        url: '/auth/signup',
                        method: HTTP_METHOD.POST,
                        body: {
                            name,
                            email,
                            password: masterKey.hash,
                        },
                    });

                    const data = res.data as AuthResponse;

                    dispatch(setToken(data.accessToken));
                    dispatch(updateUserData({ name, email }));
                    dispatch(addKey(masterKey.key));
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
