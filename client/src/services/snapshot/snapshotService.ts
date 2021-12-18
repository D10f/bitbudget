import { set, get, del } from "idb-keyval";
import { RootState } from "../../app/store";
import api from "../api/apiService";

const CRYPTO_INDEX_KEY = "cryptoKey";

class SnapshotService {
  constructor(
    private readonly ApiService: typeof api,
    private readonly cryptoIndexdbKey: string
  ) {}

  async generateCryptoKey(password: string) {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // Store key material in indexedDB
    await set(this.cryptoIndexdbKey, keyMaterial);
  }

  async deleteCryptoKey() {
    await del(this.cryptoIndexdbKey);
  }

  async deriveKey(salt = crypto.getRandomValues(new Uint8Array(32))) {
    // Retrieve key material from store
    const keyMaterial = await get(this.cryptoIndexdbKey);

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 250000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    return { key, salt };
  }

  async encryptData(data: BufferSource) {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const { key, salt } = await this.deriveKey();

    const encryptedBuffer: ArrayBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedBuffer)]);
  }

  async decryptData(encryptedBuffer: ArrayBuffer) {
    const encryptedBytes = new Uint8Array(encryptedBuffer);

    const salt = encryptedBytes.slice(0, 32);
    const iv = encryptedBytes.slice(32, 32 + 16);
    const data = encryptedBytes.slice(32 + 16);

    const { key } = await this.deriveKey(salt);

    const decryptedBuffer: ArrayBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return decryptedBuffer;
  }

  async objectToBuffer(obj: Object) {
    const dataJSON = JSON.stringify(obj);
    const dataBlob = new Blob([dataJSON], { type: "application/json" });
    return await dataBlob.arrayBuffer();
  }

  async createEncryptedSnapshot(state: RootState) {
    const { user, wallets } = state;
    const dataBuffer = await this.objectToBuffer(wallets);
    const encryptedData = await this.encryptData(dataBuffer);
    await this.ApiService.patch(`/users/${user.user?.id}`, encryptedData);
  }

  async decryptSnapshot(encryptedSnapshot: string) {
    // atob turns into a string, it needs to be converted into an array
    const encryptedBufferAsString = atob(encryptedSnapshot).split(",");

    // Uint8Array constructor only accepts array of numbers, not strings
    const encryptedBuffer = new Uint8Array(encryptedBufferAsString.map(Number));

    const decryptedBuffer = await this.decryptData(encryptedBuffer);
    const decodedData = new TextDecoder().decode(decryptedBuffer);
    const decryptedData = JSON.parse(decodedData);
    if (!decryptedData) throw new Error("Unable to decrypt user data!");
    return decryptedData;
  }
}

export default new SnapshotService(api, CRYPTO_INDEX_KEY);
