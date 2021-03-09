import axios from 'axios';
import store from '../redux/store/store';
import { encryptData } from '../utils/crypto';

const useSnapshot = () => {
  return async () => {

    const currentState = store.getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentState.user.token}`
      }
    };

    const data = new Blob([ JSON.stringify(currentState) ], { type: 'application/json' });
    const dataBuffer = await data.arrayBuffer();

    try {
      const encryptedData = await encryptData(dataBuffer);
      const response = await axios.post('http://localhost:5000/snapshot', { data: encryptedData }, config);
    } catch (e) {
      console.error('network error', e);
    }
  };
};

export default useSnapshot;
