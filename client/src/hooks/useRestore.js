import axios from 'axios';
import store from '../redux/store/store';
import { decryptData } from '../utils/crypto';

const useRestore = () => {
  return async (authToken) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }

    try {
      const response = await axios.get('http://localhost:5000/snapshot', config);
      const decryptedBuffer = await decryptData(response.data.snapshot.data.data); // What a mouthful!
      const decoder = new TextDecoder();
      const decodedData = decoder.decode(decryptedBuffer) ;
      const store = JSON.parse(decodedData);
      return store;
    } catch (e) {
      console.error(e);
    }
  };
};

export default useRestore;
