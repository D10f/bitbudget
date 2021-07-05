import api from './api';
import { encryptData, decryptData } from './crypto';

/**
* Transforms a regular JavaScript object into an ArrayBuffer
* @param  {object}      object An expense, wallet or some other JS object.
* @return {arrayBuffer}        ArrayBuffer representing the object
*/
export const objectToBuffer = async obj => {
  const dataJSON = JSON.stringify(obj);
  const dataBlob = new Blob([dataJSON], { type: 'application/json' });
  return await dataBlob.arrayBuffer();
};

/**
* Encrypts data and uploads it to the corresponding endpoint
* @param  {object} data The data to encrypt, REST API endpoint and auth token.
* @return {void}
*/
export const createSnapshot = async data => {
  const dataBuffer = await objectToBuffer(data.payload);
  const encryptedData = await encryptData(dataBuffer);

  // const config = {
  //   headers: {
  //     'Content-type': 'application/json',
  //     'Authorization': `Bearer ${data.token}`
  //   }
  // };

  const payload = {
    data: btoa(encryptedData),
    ...data.options
  };

  // endpoint should contain both HTTP verb and url e.g.:
  // 'POST /user/123'
  const [ method, url ] = endpoint.toLowerCase().split(' ');

  return await api[method](url, payload);
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
  const userSettings = JSON.parse(decodedData);
  if (!userSettings) throw new Error('Unable to decrypt user data!');
  return userSettings;
};
