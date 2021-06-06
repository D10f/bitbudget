import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { encryptData, decryptData } from '../utils/crypto';

// TODO: break down into multiple functions

export const uploadImage = (file, expenseId, token) => {
  return file.arrayBuffer()
    .then(encryptData)
    .then(encryptedData => {
      const filename = uuidv4();
      return fetch(
        `http://localhost:5000/image/${filename}/${expenseId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': `Bearer ${token}`
          },
          body: encryptedData
        }
      )
      .then(res => res.text())
    });
};

export const loadImage = async (url, token) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Network error: could not retrieve image');

    const buffer = await res.arrayBuffer();
    const decryptedBuffer = await decryptData(buffer);
    const blob = new Blob([decryptedBuffer]);

    return blob;
  } catch (err) {
    return err;
    // console.error(err.message);
    // addError(err.message);
  }
};

export const removeImage = async (url, token) => {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Network error: could not remove image');
    return 'AAAAAAAAA'
  } catch (err) {
    return err;
  }
};
