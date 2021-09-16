import { encryptData, decryptData } from './crypto';

/**
* Transforms a regular JavaScript object into an ArrayBuffer
* @param  {object}      obj An expense, wallet or some other JS object.
* @return {arrayBuffer}     ArrayBuffer representing the object
*/
export const objectToBuffer = async obj => {
  const dataJSON = JSON.stringify(obj);
  const dataBlob = new Blob([dataJSON], { type: 'application/json' });
  return await dataBlob.arrayBuffer();
};

/**
* Encrypts data and returns it as a base64 string representation
* @param  {object} data The data to encrypt, REST API endpoint and auth token.
* @return {string}      Base64 encoded version of the encrypted data
*/
export const createEncryptedSnapshot = async data => {
  const dataBuffer = await objectToBuffer(data);
  const encryptedData = await encryptData(dataBuffer);
  return btoa(encryptedData);
};

/**
* Decrypts a piece of state's encrypted data
* @param  {string} encryptedData The encrypted data in base64 encoded format
* @return {object}               The decrypted data as a plain JavaScript object
*/
export const restoreSnapshot = async (encryptedData) => {
  // atob turns into a string, it needs to be converted into an array
  const encryptedBuffer = atob(encryptedData).split(',');
  const decryptedBuffer = await decryptData(encryptedBuffer);
  const decodedData = new TextDecoder().decode(decryptedBuffer);
  const decryptedData = JSON.parse(decodedData);
  if (!decryptedData) throw new Error('Unable to decrypt user data!');
  return decryptedData;
};
