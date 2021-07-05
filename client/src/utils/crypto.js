import { get, set } from 'idb-keyval';

export const generateCryptoKey = async (password) => {

  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);

  try {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encodedPassword,
      "PBKDF2",
      false,
      ['deriveKey']
    );

    // Store key material in indexedDB
    await set('cryptoKey', keyMaterial);

  } catch (e) {
    console.error(e.message)
  }
};

export const deriveKey = async (salt = crypto.getRandomValues(new Uint8Array(32))) => {

  // Retrieve key material from store
  const keyMaterial = await get('cryptoKey');

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

export const encryptData = async (data) => {

  // Initialization vector is different everytime
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const { key, salt } = await deriveKey();

  const encryptedBuffer = await crypto.subtle.encrypt(
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

export const decryptData = async (encryptedBuffer) => {

  const encryptedBytes = new Uint8Array(encryptedBuffer);

  const salt = encryptedBytes.slice(0, 32);
  const iv = encryptedBytes.slice(32, 32 + 16);
  const data = encryptedBytes.slice(32 + 16);

  const { key } = await deriveKey(salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return decryptedBuffer;
};
