import { SET_USER, LOGOUT_USER, UPDATE_USER } from '../actionTypes';
import { addWallet, setWallets } from './wallet';
import { setExpenses } from './expenses';
import { generateCryptoKey } from '../../utils/crypto';
import { del } from 'idb-keyval';
import axios from 'axios';

export const setUser = (user = {}) => ({
  type: SET_USER,
  payload: user
});

export const startLoginUser = (userData = {}) => {
  return (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.post('http://localhost:5000/login', userData, config)
      .then(({ data }) => {

        const { user, token } = data;

        return generateCryptoKey(userData.password)
        .then(() => {
          user.token = token;
          dispatch(setUser(user));
          return token;
          // On login, fetch latest SnapShot and restore session
        });
      })
      .catch(err => {
        console.error(err);
        return false;
      });
  };
};

export const startSignupUser = (userData = {}) => {
  return (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.post('http://localhost:5000/signup', userData, config)
    .then(({ data }) => {

      const { user, token } = data;

      generateCryptoKey(userData.password)
      .then(() => {
        user.token = token;
        dispatch(setUser(user));
      });
    })
    .catch(console.error);
  };
};

export const logoutUser = () => ({
  type: LOGOUT_USER
});

export const startLogoutUser = (authToken) => {
  return (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    };

    return axios.get('http://localhost:5000/users/logout', config)
      .then(() => {
        del('cryptoKey');
        dispatch(logoutUser());
        dispatch(setExpenses([]));
        dispatch(setWallets([{ name: 'Default Wallet', budget: 0, currency: '¥', isCurrent: true }]));
      })
      .catch(console.error);
  };
};

export const updateUser = (updates = {}) => ({
  type: UPDATE_USER,
  payload: updates
})

export const startUpdateUser = (updates, authToken) => {
  return (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    };

    return axios.put('http://localhost:5000/user', updates, config)
    .then(() => dispatch(updateUser({ updates })))
    .catch(console.error);
  };
};
