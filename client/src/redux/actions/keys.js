// import { SET_KEY } from '../actionTypes';
//
// export const setKey = (key) => ({
//   type: SET_KEY,
//   payload: key
// });
//
// export const startSetKey = (salt, iv, password) => {
//   return async (dispatch) => {
//
//     const encoder = new TextEncoder();
//     const passkey = encoder.encode(password);
//
//     try {
//       const keyMaterial = await crypto.subtle.importKey(
//         "raw",
//         passkey,
//         "PBKDF2",
//         false,
//         ['deriveKey']
//       );
//
//       const key = await crypto.subtle.deriveKey(
//         {
//           name: "PBKDF2",
//           salt,
//           iterations: 250000,
//           hash: "SHA-256"
//         },
//         keyMaterial,
//         { name: "AES-GCM", length: 256 },
//         true,
//         [ "encrypt", "decrypt" ]
//       );
//
//       // Save encryption key to indexDB
//       // dispatch(setKey(key));
//
//     } catch (e) {
//       console.error(e.message)
//     }
//   };
// };
