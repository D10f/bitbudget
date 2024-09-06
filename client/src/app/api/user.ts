import { HTTP_METHOD } from '../../types/http';
import { baseApi } from '@app/api/base';
import { encrypt, wrapKey } from '../../services/crypto';
import { deserializeKey } from '../../services/keys';
import type { User } from '@features/user/types';
import { RootState } from '@app/store';

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
                    const vaultKey = await deserializeKey(userVault.at(-1)!);
                    const finalUpdates: OutputUserUpdates = {};

                    if (updates.prefs) {
                        const prefs = await encrypt(vaultKey, updates.prefs);
                        finalUpdates['prefs'] = prefs.base64;
                    }

                    if (updates.vaultKey) {
                        const masterKey = await deserializeKey(
                            userVault.at(0)!,
                        );
                        const wrappedKey = await wrapKey(vaultKey, masterKey);
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
