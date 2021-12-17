import { get, set } from "idb-keyval";

export const CRYPTO_INDEX_KEY = 'cryptoKey';

export const generateCryptoKey = async (password: string) => {
  try {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // Store key material in indexedDB
    await set(CRYPTO_INDEX_KEY, keyMaterial);
    
  } catch (error) {
    console.error((error as Error).message);
  }
};

export const deriveKey = async (salt = crypto.getRandomValues(new Uint8Array(32))) => {

  // Retrieve key material from store
  const keyMaterial = await get(CRYPTO_INDEX_KEY);

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [ "encrypt", "decrypt" ]
  );

  return { key, salt };
};

export const encryptData = async (data: BufferSource) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const { key, salt } = await deriveKey();

  const encryptedBuffer: ArrayBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(encryptedBuffer)
  ]);
};

export const decryptData = async (encryptedBuffer: ArrayBuffer) => {

  const encryptedBytes = new Uint8Array(encryptedBuffer);

  const salt = encryptedBytes.slice(0, 32);
  const iv = encryptedBytes.slice(32, 32 + 16);
  const data = encryptedBytes.slice(32 + 16);

  const { key } = await deriveKey(salt);

  const decryptedBuffer: ArrayBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return decryptedBuffer;
};
