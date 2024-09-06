import { Buffer } from './Buffer';
import { generateEncryptionKey } from './keys';

export async function encrypt(masterKey: CryptoKey, data: unknown) {
    const clearText = await Buffer.from(data);

    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await generateEncryptionKey();

    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        clearText.raw,
    );

    const wrappedKey = await wrapKey(key, masterKey);

    return Buffer.concat(wrappedKey, iv, encryptedData);
}

export async function wrapKey(key: CryptoKey, masterKey: CryptoKey) {
    if (!masterKey.usages.includes('wrapKey')) {
        throw new Error('Unable to wrap key using the provided master key.');
    }
    const keyBytes = await window.crypto.subtle.wrapKey(
        'raw',
        key,
        masterKey,
        'AES-KW',
    );
    return Buffer.from(keyBytes);
}
