import {
  AnyAction,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import moment from "moment";
import { RootState } from "../../app/store";
import Api from "../../services/api/apiService";
import IndexDBStorage from "../../services/indexdbStorage/IndexDBStorage";
import snapshotService from "../../services/snapshot/snapshotService";
import { decryptExpensesWithWorkers, formatDateAsMMYY } from "../../utils/expenses";
import { selectDaysInCurrentMonth, selectFilters } from "../filters/filtersSlice";
import { addNotification } from "../notifications/notificationsSlice";
import { selectCurrentWallet } from "../wallets/walletsSlice";

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

      // Update local storage (indexdb)
      // const existingExpenses = await IndexDBStorage.getItem(indexedDBExpenseKey);
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
        `/wallets/expenses/${currentWallet.id}/${currentMMYY}`
      );

      // Decrypt expenses
      const decryptedExpenses = await decryptExpensesWithWorkers(response.data);

      // Save to indexedDB
      await IndexDBStorage.setItem(indexedDBExpenseKey, decryptedExpenses);
      
      // Update redux state
      dispatch(setExpenses(decryptedExpenses));
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
export const selectCurrentExpenses = createSelector(
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

/**
 * Selects the total amount for all expenses in the current wallet and month
 */
export const selectCurrentExpenseAmount = createSelector(
  [selectCurrentExpenses],
  (expenses) => expenses.reduce((total, expense) => total + +(expense.amount), 0)
);

/**
 * Selects the total spent amount, sorted by expense day of month.
 */
 export const selectAmountByDay = createSelector(
  [selectCurrentExpenses, selectDaysInCurrentMonth],
  (expenses, daysInMonth) => {
    // Chart.js expects an array of values, in this case each item represents an amount per day of
    // the month. Amount defaults to 0.
    const expenseResult = new Array(daysInMonth).fill(0);
    const incomeResult  = new Array(daysInMonth).fill(0);

    expenses.forEach(({ createdAt, amount, category }) => {
      // Get the numeric day when expense was created, substracting 1 because arrays are 0-indexed.
      const expenseDay = +(moment(createdAt).format('D')) - 1;

      // Increase total amount for that day by the amount of current expense
      if (category.toLowerCase() === 'income') {
        // incomeResult[expenseDay] += parseFloat((+amount / 100).toFixed(2));
        incomeResult[expenseDay] += parseFloat(amount);
      } else {
        // expenseResult[expenseDay] += parseFloat((+amount / 100).toFixed(2));
        expenseResult[expenseDay] += parseFloat(amount);
      }
    });

    return [ expenseResult, incomeResult ];
  }
);


export const { addExpense, modifyExpense, setExpenses, setLoading } =
  expensesSlice.actions;
export default expensesSlice.reducer;
