import { combineReducers } from 'redux';
import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import userReducer from '../reducers/userReducer';
import expenseReducer from '../reducers/expenseReducer';
import filtersReducer from '../reducers/filtersReducer';
import walletReducer from '../reducers/walletReducer';
import themeReducer from '../reducers/themeReducer';
import categoriesReducer from '../reducers/categoriesReducer';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: [
    'user',
    'expenses',
    'filters',
    'wallets',
    'theme',
    'categories'
  ]
};

const rootReducer = combineReducers({
  user: userReducer,
  expenses: expenseReducer,
  filters: filtersReducer,
  wallets: walletReducer,
  theme: themeReducer,
  categories: categoriesReducer
});

export default persistReducer(persistConfig, rootReducer);
