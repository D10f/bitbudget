import {
  AnyAction,
  createDraftSafeSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import moment from "moment";
import { RootState } from "../../app/store";
import Api from "../../services/api/apiService";
import IndexDBStorage from "../../services/indexdbStorage/IndexDBStorage";
import snapshotService from "../../services/snapshot/snapshotService";
import { formatDateAsMMYY } from "../../utils/formatDateAsMMYY";
import { selectCurrentMMYY, selectFilters } from "../filters/filtersSlice";
import { addNotification } from "../notifications/notificationsSlice";
import { selectCurrentWallet } from "../wallets/walletsSlice";

// const mockExpenses: IExpense[] = [
//   {
//     id: Math.random().toString(),
//     title: "Beer",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quae iste asperiores quasi excepturi et.",
//     amount: "2",
//     createdAt:
//       "Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)",
//     category: "Drinks",
//     walletId: "123",
//   },
//   {
//     id: Math.random().toString(),
//     title: "Shopping",
//     description: "Consectetur adipisicing elit.",
//     amount: "36.18",
//     createdAt:
//       "Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)",
//     category: "Groceries",
//     walletId: "123",
//   },
//   {
//     id: Math.random().toString(),
//     title: "Fuel",
//     description: "",
//     amount: "40",
//     createdAt:
//       "Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)",
//     category: "Transport",
//     walletId: "123",
//   },
//   {
//     id: Math.random().toString(),
//     title: "Phone charger",
//     description: "Aliquam quae iste asperiores quasi excepturi et.",
//     amount: "8.99",
//     createdAt:
//       "Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)",
//     category: "Electronics",
//     walletId: "123",
//   },
//   {
//     id: Math.random().toString(),
//     title: "Christmas presents for this year",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quae iste asperiores quasi excepturi et.",
//     amount: "120.41",
//     createdAt:
//       "Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)",
//     category: "Other",
//     walletId: "123",
//   },
// ];

interface IExpense {
  id: string;
  title: string;
  description: string;
  amount: string;
  createdAt: string;
  category: string;
  walletId: string;
}

interface ExpensesState {
  expenses: IExpense[];
  loading: boolean;
}

const initialState: ExpensesState = {
  expenses: [],
  loading: false,
};

export const createExpense =
  (expense: IExpense): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      // encrypt sensitive information
      const data = await snapshotService.encryptAsBase64String({
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
      });

      // reconstruct expense for upload
      const encryptedExpense = {
        _id: expense.id,
        data,
        walletId: expense.walletId,
        expenseDate: formatDateAsMMYY(expense.createdAt),
      };

      dispatch(addExpense(expense));
      await Api.post("/expenses", encryptedExpense);
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateExpense =
  (expense: IExpense): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));

      // encrypt sensitive information
      const data = await snapshotService.encryptAsBase64String({
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
      });

      const currentExpense = getState().expenses.expenses.find(
        (exp) => exp.id === expense.id
      )!;

      // reconstruct expense for upload
      const encryptedExpense = {
        _id: expense.id,
        data,
        walletId: expense.walletId,
        expenseDate: formatDateAsMMYY(currentExpense.createdAt),
        newExpenseDate: formatDateAsMMYY(expense.createdAt),
      };

      dispatch(modifyExpense(expense));
      await Api.patch(`/expenses/${expense.id}`, encryptedExpense);
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const startGetExpenses =
  (
    currentWallet: IWallet,
    currentMMYY: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const indexedDBExpenseKey = `expenses:${currentWallet.id}:${currentMMYY}`;
      let expenses: IExpense[];

      // Check and retrieve expenses from local storage first
      expenses = await IndexDBStorage.getItem(indexedDBExpenseKey);
      
      if (expenses) {
        return dispatch(setExpenses(expenses));
      }

      // If unavailable, continue with a new API call
      const response = await Api.get(
        `/wallets/expenses?q=${currentWallet.id}&mmyy=${currentMMYY}`
      );

      console.log(response);

      // Decrypt expenses
      // const decryptedExpenses = await decryptExpensesWithWorkers(response.data);

      // Save to indexedDB
      // await IndexDBStorage.setItem(indexedDBExpenseKey, decryptedExpenses);

      // Update redux state
      // dispatch(setExpenses(decryptedExpenses));
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenses = [...state.expenses, action.payload];
    },
    modifyExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenses = state.expenses.map((expense) =>
        expense.id === action.payload.id ? action.payload : expense
      );
    },
    setExpenses: (state, action: PayloadAction<IExpense[]>) => {
      state.expenses = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

// SELECTORS

const selectExpenses = (state: RootState) => state.expenses.expenses;

/**
 * Selects the expenses for the current wallet and current month
 */
export const selectCurrentExpenses = createDraftSafeSelector(
  [selectExpenses, selectCurrentWallet, selectFilters],
  (expenses, wallet, { currentMonth, currentYear }) => {
    return expenses.filter((expense) => {
      const createdAtMoment = moment(expense.createdAt);
      return (
        expense.walletId === wallet?.id &&
        createdAtMoment.month() === currentMonth &&
        createdAtMoment.year() === currentYear
      );
    });
  }
);

export const { addExpense, modifyExpense, setExpenses, setLoading } =
  expensesSlice.actions;
export default expensesSlice.reducer;
