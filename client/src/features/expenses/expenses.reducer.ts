import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum expenseLoadingState {
  IDLE,
  LOADING,
}

interface IExpense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpensesState {
  expenses: IExpense[];
  loading: expenseLoadingState;
}

const initialState: ExpensesState = {
  expenses: [],
  loading: expenseLoadingState.IDLE,
};

export const expensesReducer = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenses = [...state.expenses, action.payload];
    },
  },
});

export const { addExpense } = expensesReducer.actions;
export default expensesReducer.reducer;
