import { HTTP_METHOD } from '../../../types/http';
import { baseApi } from '@app/api/base';
import { RootState } from '@app/store';
import type { User } from '@features/user/types';
import { SymmetricKey } from '@services/SymmetricKey';

type InputUserUpdates = Partial<
    Pick<User, 'email' | 'prefs'> & { vaultKey: JsonWebKey }
>;
type OutputUserUpdates = Partial<{
    email: string;
    prefs: string;
    vaultKey: string;
}>;

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation<OutputUserUpdates, InputUserUpdates>({
            queryFn: async (updates, { getState }, _extra, baseQuery) => {
                try {
                    const userVault = (getState() as RootState).user.vault;
                    const vaultKey = await SymmetricKey.from(userVault.at(-1)!);
                    const finalUpdates: OutputUserUpdates = {};

                    if (updates.prefs) {
                        const userPrefs = await vaultKey.encrypt(updates.prefs);
                        finalUpdates['prefs'] = userPrefs.base64;
                    }

                    if (updates.vaultKey) {
                        const masterKey = await SymmetricKey.from(
                            userVault.at(0)!,
                        );
                        const wrappedKey = await vaultKey.wrapWith(masterKey);
                        finalUpdates['vaultKey'] = wrappedKey.base64;
                    }

                    const res = await baseQuery({
                        url: '/user/update',
                        method: HTTP_METHOD.PATCH,
                        body: finalUpdates,
                    });

                    return { data: res.data as OutputUserUpdates };
                } catch (error) {
                    return { error };
                }
            },
        }),
    }),
});

export const { useUpdateUserMutation } = userApi;
