import { get, set } from 'idb-keyval';

/**
* Generates an encryption key using a low-entropy secret (password provided by user)
* @param  {string} password A password provided by the user
* @return {void}
*/
export const generateCryptoKey = async (password) => {

  const encodedPassword = new TextEncoder().encode(password);

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

/**
* Derives a de/encryption key. If no salt is provided it will be generated.
* @param  {Uint8Array?} salt An optional value of random bytes
* @return {object}           Contains the key, and salt used to derive it
*/
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

/**
* Encrypts some data
* @param  {ArrayBuffer} data The data to be encrypted in an ArrayBuffer form
* @return {Uint8Array}       Array of bytes with the salt, iv and encrypted data
*/
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

/**
* Decrypts some data
* @param  {ArrayBuffer} encryptedBuffer The data to be decrypted
* @return {ArrayBuffer}                 Decrypted data as an ArrayBuffer
*/
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
