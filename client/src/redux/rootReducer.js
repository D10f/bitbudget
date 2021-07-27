import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

import userReducer from './user/reducer';
import walletReducer from './wallets/reducer';
import themeReducer from './theme/reducer';
import notificationReducer from './notifications/reducer';
import expenseReducer from './expenses/reducer';
import filtersReducer from './filters/reducer';
import categoriesReducer from './categories/reducer';

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
  filters: filtersReducer,
  wallets: walletReducer,
  theme: themeReducer,
  categories: categoriesReducer,
  notifications: notificationReducer
});

export default persistReducer(persistConfig, rootReducer);
