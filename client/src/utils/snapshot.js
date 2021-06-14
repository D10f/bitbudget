import { encryptData, decryptData, generateCryptoKey } from './crypto';
import axios from 'axios';

export const createSnapshot = async (data, password = '') => {
  // This only needed for when a new user signs up
  if (password) await generateCryptoKey(password);

  const snapshotData = {
    categories: data.categories,
    expenses: data.expenses,
    theme: data.theme,
    user: data.user,
    wallets: data.wallets
  };

  const dataJSON = JSON.stringify(snapshotData);
  const dataBlob = new Blob([dataJSON], { type: 'application/json' });
  const dataBuffer = await dataBlob.arrayBuffer();
  const encryptedData = await encryptData(dataBuffer);
  return axios.post('http://localhost:5000/snapshot',
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

export const restoreSnapshot = async (user, password) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  };

  await generateCryptoKey(password);
  const response = await axios.get('http://localhost:5000/snapshot', config);
  const decryptedBuffer = await decryptData(response.data.snapshot.data.data);
  const decodedData = new TextDecoder().decode(decryptedBuffer);
  const store = JSON.parse(decodedData);

  if (!store) throw new Error('Unable to decrypt user data!');

  return store;
};
