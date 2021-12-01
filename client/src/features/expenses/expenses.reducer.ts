import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IExpense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpensesState {
  expenses: IExpense[];
}

const initialState: ExpensesState = {
  expenses: []
};

export const expensesReducer = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenses.push(action.payload);
    }
  }
});

export const { addExpense } = expensesReducer.actions;
export default expensesReducer.reducer;
