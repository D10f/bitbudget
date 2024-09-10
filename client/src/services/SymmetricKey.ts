import { encrypt, decryptData } from '@services/crypto';
import {
    deserializeKey,
    serializeKey,
    unwrapEncryptionKey,
    unwrapVaultKey,
    wrapKey,
} from '@services/keys';

export class SymmetricKey {
    private constructor(public readonly key: CryptoKey) {}

    static async from(inputKey: SymmetricKey | CryptoKey | JsonWebKey) {
        if (inputKey instanceof CryptoKey) {
            return new SymmetricKey(inputKey);
        }

        if (inputKey instanceof SymmetricKey) {
            return inputKey;
        }

        return new SymmetricKey(await deserializeKey(inputKey));
    }

    static async fromWrap(
        input: Uint8Array | string,
        key: SymmetricKey | CryptoKey,
    ) {
        const masterKey = await SymmetricKey.from(key);
        const wrappedKey =
            input instanceof Uint8Array
                ? await unwrapEncryptionKey(input, masterKey.key)
                : await unwrapVaultKey(input, masterKey.key);
        return SymmetricKey.from(wrappedKey);
    }

    toJSON() {
        if (!this.extractable) {
            throw new Error('This key cannot be extracted.');
        }
        return serializeKey(this.key);
    }

    can(usage: KeyUsage) {
        return this.key.usages.includes(usage);
    }

    private get extractable() {
        return this.key.extractable;
    }

    async wrapWith(key: SymmetricKey | CryptoKey | JsonWebKey) {
        const wrappingKey = await SymmetricKey.from(key);

        if (!wrappingKey.can('wrapKey')) {
            throw new Error('Provided key cannot be used for wrapping.');
        }

        if (!this.extractable) {
            throw new Error('This key cannot be exported.');
        }

        return wrapKey(this.key, wrappingKey.key);
    }

    async encrypt(data: unknown) {
        if (!this.can('encrypt')) {
            throw new Error('This key cannot be used for encryption.');
        }
        return encrypt(this.key, data);
    }

    async decrypt<T>(data: string) {
        if (!this.can('unwrapKey')) {
            throw new Error('This key cannot be used for unwrapping.');
        }
        return decryptData<T>(this.key, data);
    }
}
