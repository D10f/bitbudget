import { Buffer } from './Buffer';

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

export function serializeKey(key: CryptoKey) {
    if (!key.extractable) {
        throw new Error('The provided key cannot be extracted!');
    }
    return window.crypto.subtle.exportKey('jwk', key);
}
