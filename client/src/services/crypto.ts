import { Buffer } from './Buffer';
import { generateEncryptionKey } from './keys';

/**
 * Encrypts the data provided as second argument using a randomly
 * generated encryption key. The key provided as the first arguments is
 * used to encrypt this random encryption key, in order to store safely
 * store it along with the rest of the data in the database.
 */
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

/**
 * Serializes and encrypts _key_ using _masterKey_. The output is an
 * external format that can be used to share the key with other systems
 * like making network requests.
 *
 * Note: As per RFC3394 the ciphertext will contain an additional block
 * of 64 bits.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc3394
 */
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
