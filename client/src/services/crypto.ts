import { Buffer } from './Buffer';

type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

/**
 * Produces a fixed-length digest of the provided data.
 */
export async function hash(algorithm: HashAlgorithm, data: unknown) {
    const input = Buffer.from(data).bytes;
    const hash = await crypto.subtle.digest(algorithm, input);
    return Buffer.from(hash).hex;
}

/**
 * Produces a fixed-length digest of the provided data.
 */
export async function pbkdf2Hash(
    data: unknown,
    salt: unknown = crypto.getRandomValues(new Uint8Array(32)),
    hash: HashAlgorithm = 'SHA-256',
    iterations = 250_000,
) {
    //const dataBuffer = Buffer.from(data);
    const saltBuffer = Buffer.from(salt).bytes;

    const key =
        data instanceof CryptoKey
            ? data
            : await deriveKeyFromPassword(Buffer.from(data).bytes);

    const bitLength = parseInt(hash.match(/-(\d+)$/)![1]);

    return crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations,
            hash,
        },
        key,
        bitLength,
    );
}

export async function deriveKeyFromPassword(
    password: string | Uint8Array | ArrayBuffer,
) {
    return await crypto.subtle.importKey(
        'raw',
        Buffer.from(password).bytes,
        'PBKDF2',
        false,
        ['deriveKey', 'deriveBits'],
    );
}

/**
 * Produces a key based on a low-entropy input. Accepts, optionally, another
 * string used for salting the resulting key.
 *
 * @param password the user's password
 * @param salt     arbitrary data used as salt e.g.: user's name
 */
export async function deriveKey(
    password: string,
    salt: unknown = crypto.getRandomValues(new Uint8Array(32)),
) {
    const key = await deriveKeyFromPassword(password);
    const saltBuffer = Buffer.from(salt).bytes;

    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltBuffer,
            iterations: 250_000,
            hash: 'SHA-256',
        },
        key,
        { name: 'AES-KW', length: 256 },
        true,
        ['wrapKey', 'unwrapKey'],
    );
}

/**
 * Produces a randomly generated 256-bit encryption key.
 */
export async function generateKey() {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    );
}
