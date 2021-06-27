import axios from 'axios';
import { encryptData, decryptData, generateCryptoKey } from './crypto';

/**
* Encrypts the user's state (portions of the Redux state that pertain to the user)
* and uploads it to the server under the User model.
* @param  {object}  state    The Redux global state
* @param  {string?} password Optional password used to create an encryption key
* @return {void}
*/
export const createUserSnapshot = async (state, password = '') => {

  // This is called during signup only; rest of snapshots happen while user is
  // already logged in and encryption key already exists.
  if (password) await generateCryptoKey(password);

  // The data to be encrypted and stored in db.
  const snapshotData = {
    categories: state.categories,
    theme: state.theme,
    wallets: state.wallets
  };

  const dataJSON = JSON.stringify(snapshotData);
  const dataBlob = new Blob([dataJSON], { type: 'application/json' });
  const dataBuffer = await dataBlob.arrayBuffer();
  const encryptedData = await encryptData(dataBuffer);

  const endpoint = 'http://localhost:5000/user/settings';
  const config = {
    headers: {
      'Content-type': 'application/octet-stream',
      'Authorization': `Bearer ${state.user.token}`
    }
  };

  await axios.post(endpoint, encryptedData, config);
};

export const createSnapshot = async (data, password = '') => {
  // This only needed for when a new user signs up
  if (password) await generateCryptoKey(password);

  const snapshotData = {
    categories: data.categories,
    expenses: data.expenses,
    theme: data.theme,
    primary: data.primary,
    user: data.user,
    wallets: data.wallets
  };

  const dataJSON = JSON.stringify(snapshotData);
  const dataBlob = new Blob([dataJSON], { type: 'application/json' });
  const dataBuffer = await dataBlob.arrayBuffer();
  const encryptedData = await encryptData(dataBuffer);
  return fetch('http://localhost:5000/snapshot',
    encryptedData,
    {
      headers: {
      'Content-type': 'application/octet-stream',
      'Authorization': `Bearer ${data.user.token}`
      }
    }
  )
  // return await axios.post(
  //   'http://localhost:5000/snapshot',
  //   { data: encryptedData },
  //   {
  //     headers: {
  //       'Content-type': 'application/octet-stream',
  //       'Authorization': `Bearer ${data.user.token}`
  //     }
  //   }
  // );
};


/**
* Encrypts the user's state (portions of the Redux state that pertain to the user)
* and uploads it to the server under the User model.
* Decrypts user's state (user.settings in User model)
* @param  {ArrayBuffer} settings The user.settings encrypted object
* @param  {object}      userObj  User object retrieved that will be hydrated with the decrypted data
* @return {object}               An plain JavaScript object containing data about the user
*/
export const restoreUserSnapshot = async (encryptedData, encryptionPassword) => {
  await generateCryptoKey(encryptionPassword);
  console.log(encryptedData.length);
  const decryptedBuffer = await decryptData(encryptedData);
  const decodedData = new TextDecoder().decode(decryptedBuffer);
  const userSettings = JSON.parse(decodedData);
  if (!userSettings) throw new Error('Unable to decrypt user data!');
  return userSettings;
};

// export const restoreSnapshot = async (user, password) => {
//
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${user.token}`
//     }
//   };
//
//   await generateCryptoKey(password);
//   const response = await axios.get('http://localhost:5000/snapshot', config);
//   const decryptedBuffer = await decryptData(response.data.snapshot.data.data);
//   const decodedData = new TextDecoder().decode(decryptedBuffer);
//   const store = JSON.parse(decodedData);
//
//   if (!store) throw new Error('Unable to decrypt user data!');
//
//   return store;
// };
