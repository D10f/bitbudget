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
import snapshotService from "../../services/snapshot/snapshotService";
import { formatDateAsMMYY } from "../../utils/formatDateAsMMYY";
import { selectFilters } from "../filters/filtersSlice";
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
        expenseDate: formatDateAsMMYY(expense.createdAt)
      }

      dispatch(addExpense(expense));
      await Api.post("/expenses", encryptedExpense);
    } catch (error) {
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

export const { addExpense, setLoading } = expensesSlice.actions;
export default expensesSlice.reducer;
