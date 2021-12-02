import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "../features/expenses/expenses.reducer";
import notificationsReducer from "../features/notifications/notifications.reducer";
import walletsReducer from "../features/wallets/wallets.reducer";

// const composeEnhancers =
//   (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    wallets: walletsReducer,
    notifications: notificationsReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
