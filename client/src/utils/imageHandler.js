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

const resizeImageAndUpload = (file, width, token, collectionId) => {
  return new Promise((resolve, reject) => {
    // const reader = new FileReader(file);

    // reader.onload = e => {
    //   const img    = new Image();
    //   img.src = e.target.result;
    //
    //   img.onload = ev => {
    //     const canvas = document.createElement('canvas');
    //     const MAX_WIDTH  = 800;
    //     const MAX_HEIGHT = 600;
    //     let width  = img.width;
    //     let height = img.height;
    //     // Add the resizing logic
    //     if (width > height) {
    //       if (width > MAX_WIDTH) {
    //         height *= MAX_WIDTH / width;
    //         width = MAX_WIDTH;
    //       }
    //     } else {
    //       if (height > MAX_HEIGHT) {
    //         width *= MAX_HEIGHT / height;
    //         height = MAX_HEIGHT;
    //       }
    //     }
    //     canvas.width  = width;
    //     canvas.height = height;
    //     const ctx = canvas.getContext('2d');
    //     ctx.drawImage(img, 0, 0, width, height);
    //     canvas.toBlob(blob => {
    //       blob.arrayBuffer()
    //       .then(encryptData)
    //       .then(uploadImage)
    //       .then(resolve)
    //       .catch(reject)
    //     }, 'image/jpeg');
    //   }
    // }
    //
    // reader.readAsDataURL(file);
  });
};

export default resizeImageAndUpload;
