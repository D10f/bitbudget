import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const mockExpenses: IExpense[] = [
  {
    id: Math.random().toString(),
    title: 'Beer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quae iste asperiores quasi excepturi et.',
    amount: '2',
    createdAt: 'Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)',
    category: 'Drinks',
  },
  {
    id: Math.random().toString(),
    title: 'Shopping',
    description: 'Consectetur adipisicing elit.',
    amount: '36.18',
    createdAt: 'Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)',
    category: 'Groceries'
  },
  {
    id: Math.random().toString(),
    title: 'Fuel',
    description: '',
    amount: '40',
    createdAt: 'Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)',
    category: 'Transport'
  },
  {
    id: Math.random().toString(),
    title: 'Phone charger',
    description: 'Aliquam quae iste asperiores quasi excepturi et.',
    amount: '8.99',
    createdAt: 'Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)',
    category: 'Electronics'
  },
  {
    id: Math.random().toString(),
    title: 'Christmas presents for this year',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam quae iste asperiores quasi excepturi et.',
    amount: '120.41',
    createdAt: 'Fri Dec 03 2021 18:49:44 GMT+0100 (Central European Standard Time)',
    category: 'Other',
  },
];

enum expenseLoadingState {
  IDLE,
  LOADING,
}

interface IExpense {
  id: string;
  title: string;
  description: string;
  amount: string;
  createdAt: string;
  category: string;
}

interface ExpensesState {
  expenses: IExpense[];
  loading: expenseLoadingState;
}

const initialState: ExpensesState = {
  expenses: mockExpenses,
  loading: expenseLoadingState.IDLE,
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<IExpense>) => {
      state.expenses = [...state.expenses, action.payload];
    },
  },
});

export const { addExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
