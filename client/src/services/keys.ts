import { Buffer } from '@services/Buffer';
import { SymmetricKey } from '@services/SymmetricKey';

/**
 * Convenience method to generate the master key and vault key in one
 * go, as these are used at the same time.
 */
export async function generateUserKeys(username: string, password: string) {
    const masterKey = await generateMasterKey(username, password);
    const vaultKey = await generateVaultKey();
    return {
        vKey: await SymmetricKey.from(vaultKey),
        mKey: masterKey.key,
        mKeyHash: masterKey.hash,
    };
}

/**
 * Generates a cryptographic key using user information, and returns the
 * key along with its cryptographic hash (calculated using PBKDF2).
 * The master key is used to encrypt a vault key, which in turn is later
 * used to encrypt further encryption keys used for encrypting data.
 * This level of indirection is in place as an extra layer of security
 * and convenience (if the user changes its password, only the vault
 * key needs to be re-encrypted).
 */
export async function generateMasterKey(username: string, password: string) {
    const usernameBuffer = await Buffer.from(username);
    const passwordBuffer = await Buffer.from(password);

    const material = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer.raw,
        'PBKDF2',
        false,
        ['deriveKey', 'deriveBits'],
    );

    const masterKey = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: usernameBuffer.raw,
            iterations: 250_000,
            hash: 'SHA-256',
        },
        material,
        {
            name: 'AES-KW',
            length: 256,
        },
        true,
        ['wrapKey', 'unwrapKey'],
    );

    const masterKeyHash = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: usernameBuffer.raw,
            iterations: 250_000,
            hash: 'SHA-256',
        },
        material,
        256,
    );

    return {
        key: await SymmetricKey.from(masterKey),
        hash: (await Buffer.from(masterKeyHash)).hex,
    };
}

/**
 * Randomly generates a cryptographic key used with the explicit
 * purpose of encrypting encryption keys.
 */
export function generateVaultKey() {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-KW',
            length: 256,
        },
        true,
        ['wrapKey', 'unwrapKey'],
    );
}

/**
 * Randomly generates a cryptographic key used with the explicit
 * purpose of encryption and decryption.
 */
export function generateEncryptionKey() {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    );
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

/**
 * @param key base64 encoded string of the (wrapped) vault key.
 */
export async function unwrapVaultKey(key: string, masterKey: CryptoKey) {
    if (!masterKey.usages.includes('unwrapKey')) {
        throw new Error('Unable to unwrap key using the provided master key.');
    }

    const keyBuffer = await Buffer.from(key, 'base64');

    return window.crypto.subtle.unwrapKey(
        'raw',
        keyBuffer.raw,
        masterKey,
        'AES-KW',
        { name: 'AES-KW', length: 256 },
        true,
        ['wrapKey', 'unwrapKey'],
    );
}

/**
 * @param key base64 encoded string of the (wrapped) encryption key.
 */
export async function unwrapEncryptionKey(
    key: Uint8Array,
    masterKey: CryptoKey,
) {
    if (!masterKey.usages.includes('unwrapKey')) {
        throw new Error('Unable to unwrap key using the provided master key.');
    }

    return window.crypto.subtle.unwrapKey(
        'raw',
        key,
        masterKey,
        'AES-KW',
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    );
}

/**
 * Converts the cryptographic key into a portable format suitable for
 * serialization. This is done in order to store cryptographic keys
 * securely stored in Redux's state.
 */
export function serializeKey(key: CryptoKey) {
    if (!key.extractable) {
        throw new Error('The provided key cannot be extracted!');
    }
    return window.crypto.subtle.exportKey('jwk', key);
}

export function deserializeKey(key: JsonWebKey) {
    return window.crypto.subtle.importKey(
        'jwk',
        key,
        {
            name: 'AES-KW',
            length: 256,
        },
        true,
        ['wrapKey', 'unwrapKey'],
    );
}
