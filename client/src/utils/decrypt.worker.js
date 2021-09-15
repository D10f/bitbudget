/*
 * When retrieving expenses from the backend API an array of objects is received, each containing a
 * single property "data" which holds encrypted information about the expense. This means each object
 * was encrypted individually and it has to be decrypted likewise. This can be computationally
 * expensive and time consuming for large dataset, this is what this file is for: it spawns a new
 * Worker that will be dedicated to decrypt an expense object and return it to the main thread.
 *
 * https://github.com/facebook/create-react-app/pull/3934
 * https://github.com/facebook/create-react-app/issues/1277#issuecomment-283147634
*/

import { decryptData } from './crypto';

const restoreSnapshot = (encryptedData) => {
  // atob turns into a string, it needs to be converted into an array
  const encryptedBuffer = atob(encryptedData).split(',');
  return decryptData(encryptedBuffer)
    .then(decryptedBuffer => {
      const decodedData = new TextDecoder().decode(decryptedBuffer);
      const decryptedData = JSON.parse(decodedData);
      if (!decryptedData) throw new Error('Unable to decrypt user data!');
      return decryptedData;
    })
    .catch(err => console.error(err));
};

onmessage = (message) => {
  const expense = message.data;
  restoreSnapshot(expense.data)
    .then(decryptedExpenseData => {
      const decryptedExpense = {
        id: expense._id,
        wallet: expense.wallet,
        ...decryptedExpenseData
      };
      postMessage(decryptedExpense);
    })
    .catch(console.error);
};
