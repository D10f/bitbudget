import { Buffer } from './Buffer';
import { generateEncryptionKey, unwrapEncryptionKey, wrapKey } from './keys';

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
 * Decrypts _data_, using _masterKey_ to unwrap the encryption key that
 * was used to encrypt the original cleartext and that is bundled with
 * _data_.
 * The first 40 bytes of _data_ are the wrapped encryption key.
 * The next 16 bytes are a random initialization vector.
 * The rest of the bytes are the encrypted data.
 *
 * @param data base64 encoded representation of the encrypted data.
 */
export async function decrypt(masterKey: CryptoKey, data: string) {
    const ciphertext = (await Buffer.from(atob(data))).raw;

    const encryptionKeyBuffer = ciphertext.slice(0, 40);
    const iv = ciphertext.slice(40, 40 + 16);
    const encryptedData = ciphertext.slice(40 + 16);

    const encryptionKey = await unwrapEncryptionKey(
        encryptionKeyBuffer,
        masterKey,
    );

    return window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        encryptionKey,
        encryptedData,
    );
}

/**
 * Across this application, most (if not all) data encrypted and
 * decrypted is going to be object types. Objects are serialized as JSON
 * strings before being encrypted, which makes the decryption process
 * much easier.
 */
export async function decryptData(
    masterKey: CryptoKey,
    data: string,
): Promise<object> {
    const buffer = await decrypt(masterKey, data);
    return JSON.parse(new TextDecoder().decode(buffer));
}

/**
 * Deserializes and decrypts _keyBuffer_, presumably the buffer of a
 * CryptoKey object, using _masterKey_. The rest of the arguments given
 * should match the _algorithm_ and key _usages_ of the wrapped key.
 * As this function will be called for keys using different parameters,
 * they are necessary to determine how to unwrap the key correctly.
 *
 * @param key base64 encoded string of the (wrapped) vault key.
 */
export async function unwrap(
    key: string,
    masterKey: CryptoKey,
    algorithm: AesKeyAlgorithm,
    usages: KeyUsage[],
) {
    if (!masterKey.usages.includes('unwrapKey')) {
        throw new Error('Unable to unwrap key using the provided master key.');
    }

    const keyBuffer = await Buffer.from(btoa(key));

    return window.crypto.subtle.unwrapKey(
        'raw',
        keyBuffer.raw,
        masterKey,
        'AES-KW',
        algorithm,
        true,
        usages,
    );
}
