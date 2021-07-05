import { combineReducers } from 'redux';
import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import userReducer from '../reducers/userReducer';
import expenseReducer from '../reducers/expenseReducer';
import queriesReducer from '../reducers/queriesReducer';
import filtersReducer from '../reducers/filtersReducer';
import walletReducer from '../reducers/walletReducer';
import themeReducer from '../reducers/themeReducer';
import categoriesReducer from '../reducers/categoriesReducer';
import notificationReducer from '../reducers/notificationReducer';

/* Whitelist refers the reducers that will persist in session storage */
const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: [
    'user',
    'expenses',
    'wallets',
    'theme',
    'categories'
  ]
};

const rootReducer = combineReducers({
  user: userReducer,
  expenses: expenseReducer,
  queries: queriesReducer,
  filters: filtersReducer,
  wallets: walletReducer,
  theme: themeReducer,
  categories: categoriesReducer,
  notifications: notificationReducer
});

export default persistReducer(persistConfig, rootReducer);
