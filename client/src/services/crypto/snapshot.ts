import { encryptData, decryptData } from './crypto';

/**
 * Transforms a regular JavaScript object into an ArrayBuffer
 */
export const objectToBuffer = async (obj: Object) => {
  const dataJSON = JSON.stringify(obj);
  const dataBlob = new Blob([dataJSON], { type: 'application/json' });
  return await dataBlob.arrayBuffer();
};

/**
 * Encrypts data and returns it as a base64 string
 */
export const createEncryptedSnapshot = async (data: Object) => {
  const dataBuffer = await objectToBuffer(data);
  const encryptedData = await encryptData(dataBuffer);
  console.log('Running ".toString()" on encryptedData!');
  return btoa(encryptedData.toString());
};

/**
 * Receives a base64 string and decrypits its contents.
 */ 
export const restoreSnapshot = async (encryptedData: string) => {
  // atob turns into a string, it needs to be converted into an array
  const encryptedBufferAsString = atob(encryptedData).split(',');

  // Uint8Array constructor only accepts array of numbers, not strings
  const encryptedBuffer = new Uint8Array(encryptedBufferAsString.map(Number));
  
  const decryptedBuffer = await decryptData(encryptedBuffer);
  const decodedData = new TextDecoder().decode(decryptedBuffer);
  const decryptedData = JSON.parse(decodedData);
  if (!decryptedData) throw new Error('Unable to decrypt user data!');
  return decryptedData;
};