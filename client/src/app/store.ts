import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "../features/categories/categoriesSlice";
import expensesReducer from "../features/expenses/expensesSlice";
import filtersSlice from "../features/filters/filtersSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import userSlice from "../features/user/userSlice";
import walletsSlice from "../features/wallets/walletsSlice";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    wallets: walletsSlice,
    notifications: notificationsReducer,
    user: userSlice,
    categories: categoriesSlice,
    filters: filtersSlice,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
