import { baseApi } from '@app/api/base';
import { setToken } from '@features/auth/authSlice';
import { HTTP_METHOD } from '../../types/http';
import {
    generateMasterKey,
    generateVaultKey,
    serializeKey,
} from '../../services/keys';
import { encrypt, wrapKey } from '../../services/crypto';
import { addKey, setUserData } from '@features/user/userSlice';
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

                    const vaultKey = await generateVaultKey();
                    const wrappedVaultKey = await wrapKey(vaultKey, key);

                    dispatch(setToken((res.data as AuthResponse).accessToken));
                    dispatch(setUserData({ name, email }));
                    dispatch(addKey(await serializeKey(vaultKey)));
                    dispatch(addKey(await serializeKey(key)));

                    const encryptedPrefs = await encrypt(vaultKey, {
                        prefs: (getState() as RootState).user.prefs,
                    });

                    await baseQuery({
                        url: '/user/update',
                        method: HTTP_METHOD.PATCH,
                        body: {
                            vaultKey: wrappedVaultKey.base64,
                            data: encryptedPrefs.base64,
                        },
                    });

                    return { data: res.data as AuthResponse };
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
