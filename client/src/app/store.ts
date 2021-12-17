import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "../features/expenses/expenses.reducer";
import notificationsReducer from "../features/notifications/notifications.reducer";
import userSlice from "../features/user/userSlice";
import walletsReducer from "../features/wallets/wallets.reducer";

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    wallets: walletsReducer,
    notifications: notificationsReducer,
    user: userSlice,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
