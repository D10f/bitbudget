import axios from 'axios';
import store from '../redux/store';

const api = axios.create({
  baseURL: `http://localhost:5000`,
  headers: {
    'Content-Type': 'application/json'
  }
});

const publicAccessRoutes = [
  '/users/login',
  '/users/signup',
];

api.interceptors.request.use(req => {
  if (publicAccessRoutes.includes(req.url)) return req;

  const { user } = store.getState();
  req.headers['Authorization'] = `Bearer ${user.token}`

  return req;
});

export default api;
