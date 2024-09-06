import { Buffer } from './Buffer';

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
        key: masterKey,
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
