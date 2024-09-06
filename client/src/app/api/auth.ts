import { baseApi } from '@app/api/base';
import { userApi } from '@app/api/user';
import { setToken } from '@features/auth/authSlice';
import { HTTP_METHOD } from '../../types/http';
import {
    generateMasterKey,
    generateVaultKey,
    serializeKey,
} from '../../services/keys';
import { addKey, resetKeys, setUserData } from '@features/user/userSlice';
import type { AuthResponse, Credentials } from '@features/auth/types';
import { RootState } from '@app/store';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation<AuthResponse, Credentials>({
            queryFn: async (
                { name, email, password },
                { dispatch, getState },
                _extra,
                baseQuery,
            ) => {
                try {
                    const { key, hash } = await generateMasterKey(
                        name,
                        password,
                    );

                    const res = await baseQuery({
                        url: '/auth/signup',
                        method: HTTP_METHOD.POST,
                        body: {
                            name,
                            email,
                            password: hash,
                        },
                    });

                    // Update access token
                    dispatch(setToken((res.data as AuthResponse).accessToken));

                    // Update local state
                    const vaultKey = await generateVaultKey();
                    dispatch(addKey(await serializeKey(vaultKey)));
                    dispatch(addKey(await serializeKey(key)));
                    dispatch(setUserData({ name, email }));

                    // Update remote state. This creates the initial user
                    // preferences on the server, along with the
                    // encrypted vault key
                    await dispatch(
                        userApi.endpoints.updateUser.initiate({
                            email,
                            prefs: (getState() as RootState).user.prefs,
                            vaultKey: await serializeKey(vaultKey),
                        }),
                    );

                    return { data: res.data as AuthResponse };
                } catch (error) {
                    dispatch(resetKeys());
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
