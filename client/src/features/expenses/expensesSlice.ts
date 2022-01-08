import {
  AnyAction,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import moment from "moment";
import { RootState } from "@app/store";
import Api from "@services/api/apiService";
import IndexDBStorage from "@services/indexdbStorage/IndexDBStorage";
import snapshotService from "@services/snapshot/snapshotService";
import { decryptExpensesWithWorkers, formatDateAsMMYY } from "@utils/expenses";
import {
  selectDaysInCurrentMonth,
  selectFilters,
} from "@features/filters/filtersSlice";
import { addNotification } from "@features/notifications/notificationsSlice";
import { selectCurrentWallet } from "@features/wallets/walletsSlice";

interface ExpensesState {
  expenses: IExpense[];
  loading: boolean;
}

interface ICategoryToExpenseMap {
  [key: string]: number;
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

      // Update local state and storage (indexdb)
      dispatch(addExpense(expense));
      await IndexDBStorage.saveExpense(
        expense,
        formatDateAsMMYY(expense.createdAt)
      );

      // encrypt sensitive information
      const data = await snapshotService.encryptAsBase64String({
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        createdAt: expense.createdAt,
      });

      // reconstruct expense for upload
      const encryptedExpense = {
        _id: expense.id,
        data,
        walletId: expense.walletId,
        expenseDate: formatDateAsMMYY(expense.createdAt),
      };

      // Synchronize with server
      await Api.post("/expenses", encryptedExpense);
      dispatch(
        addNotification({
          msg: "Expense created successfully",
          type: "success",
        })
      );
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

      // Update local state and storage (indexdb)
      dispatch(modifyExpense(expense));
      await IndexDBStorage.saveExpense(
        expense,
        formatDateAsMMYY(expense.createdAt)
      );

      // encrypt sensitive information
      const data = await snapshotService.encryptAsBase64String({
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        createdAt: expense.createdAt,
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

      await Api.patch(`/expenses/${expense.id}`, encryptedExpense);
    } catch (error) {
      dispatch(
        addNotification({ msg: (error as Error).message, type: "error" })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteExpense =
  (expense: IExpense): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(removeExpense(expense.id));
      const expenseDateAsMMY = formatDateAsMMYY(expense.createdAt);

      await IndexDBStorage.deleteExpense(expense, expenseDateAsMMY);

      await Api.delete(`/expenses/${expense.id}/${expenseDateAsMMY}`);

      dispatch(
        addNotification({
          msg: "Expense deleted Successfully",
          type: "success",
        })
      );
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
      let expenses: IExpense[] | undefined;

      // Check and retrieve expenses from local storage first
      expenses = await IndexDBStorage.getItem<IExpense[]>(indexedDBExpenseKey);

      if (expenses) {
        return dispatch(setExpenses(expenses));
      }

      // If unavailable, continue with a new API call
      const response = await Api.get(
        `/wallets/expenses/${currentWallet.id}/${currentMMYY}`
      );

      // Decrypt expenses
      const decryptedExpenses = await decryptExpensesWithWorkers(response.data);
      console.log(decryptedExpenses);

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
    removeExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
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
  (expenses) => {
    let expenseAmnt = 0;
    let incomeAmnt = 0;

    for (const expense of expenses) {
      if (+expense.amount >= 0 || expense.category.toLowerCase() === "income") {
        expenseAmnt += +expense.amount;
      } else {
        incomeAmnt += Math.abs(+expense.amount);
      }
    }

    return [expenseAmnt, incomeAmnt];
  }
);

/**
 * Selects the total spent amount, sorted by expense day of month.
 */
export const selectAmountByDay = createSelector(
  [selectCurrentExpenses, selectDaysInCurrentMonth],
  (expenses, daysInMonth) => {
    const expenseResult = new Array(daysInMonth).fill(0);
    const incomeResult = new Array(daysInMonth).fill(0);

    for (const { createdAt, amount, category } of expenses) {
      const expenseDay = +moment(createdAt).format("D") - 1;
      if (+amount >= 0 || category.toLowerCase() === "income") {
        // expenseResult[expenseDay] += parseFloat((+amount / 100).toFixed(2));
        expenseResult[expenseDay] += parseFloat(amount);
      } else {
        incomeResult[expenseDay] += parseFloat(amount);
      }
    }

    return [expenseResult, incomeResult];
  }
);

/**
 * Selects the different categories in the current expenses by name
 */
export const selectCategoriesByName = createSelector(
  [selectCurrentExpenses],
  (expenses) => {
    const categories = new Set<string>();
    for (const expense of expenses) {
      categories.add(expense.category);
    }
    return Array.from(categories);
  }
);

/**
 * Selects the number of different categories in the current expenses
 */
export const selectTotalCategories = createSelector(
  [selectCategoriesByName],
  (categoryArray) => categoryArray.length
);

/**
 * Selects the total spent amount, sorted by expense category.
 */
// export const selectAmountByCategory = createSelector(
//   [selectCurrentExpenses, selectCategoriesByName],
//   (expenses, categories) => {
//     const result = categories.reduce((acc: ICategoryToExpenseMap, cat) => {
//       acc[cat.toLowerCase()] = 0;
//       return acc;
//     }, {});

//     for (const { category, amount } of expenses) {
//       result[category.toLowerCase()] += Math.abs(+amount);
//     }

//     return Object.values(result);
//   }
// );

/**
 * Selects the percentage spent amount, sorted by expense category.
 */
export const selectPercentByCategory = createSelector(
  [selectCurrentExpenses, selectCategoriesByName, selectCurrentExpenseAmount],
  (expenses, categories, [expenseTotal, incomeTotal]) => {
    const result = categories.reduce((acc: ICategoryToExpenseMap, cat) => {
      acc[cat.toLowerCase()] = 0;
      return acc;
    }, {});

    const totalAmount = expenseTotal + incomeTotal;

    for (const { category, amount } of expenses) {
      result[category.toLowerCase()] += (Math.abs(+amount) * 100) / totalAmount;
    }

    return Object.values(result);
  }
);

export const {
  addExpense,
  modifyExpense,
  removeExpense,
  setExpenses,
  setLoading,
} = expensesSlice.actions;
export default expensesSlice.reducer;
