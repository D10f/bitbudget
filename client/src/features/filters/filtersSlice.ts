import {
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import moment from "moment";
import { RootState } from "../../app/store";

interface IFilters {
  currentMonth: number;
  currentYear: number;
}

const initialState: IFilters = {
  currentMonth: moment().month(),
  currentYear: moment().year(),
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCurrentMonth: (state, action) => {},
  },
});

// SELECTORS

export const selectFilters = (state: RootState) => state.filters;

export const selectCurrentMMYY = createSelector(
  selectFilters,
  ({ currentMonth, currentYear }: IFilters) =>
    `${currentMonth.toString().padStart(2, "0")}` +
    `${currentYear.toString().slice(2)}`
);

export const { setCurrentMonth } = filtersSlice.actions;
export default filtersSlice.reducer;
