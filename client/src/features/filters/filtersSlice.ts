import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { RootState } from "@app/store";
import { months } from "@constants";

interface IFilters {
  currentMonth: number;
  currentYear: number;
  searchText: string;
}

export interface IFilterUpdate {
  newMonth: number;
  newYear: number;
}

const initialState: IFilters = {
  currentMonth: moment().month(),
  currentYear: moment().year(),
  searchText: "",
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCurrentMonth: (state, action: PayloadAction<IFilterUpdate>) => {
      state.currentMonth = action.payload.newMonth;
      state.currentYear = action.payload.newYear;
    },
    setTextFilter: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    resetFilters: (state) => {
      state = {
        currentMonth: moment().month(),
        currentYear: moment().year(),
        searchText: "",
      };
    },
  },
});

// SELECTORS

export const selectFilters = (state: RootState) => state.filters;

/* Returns a string with the current month and year selected, formatted as MMYY */
export const selectCurrentMMYY = createSelector(
  selectFilters,
  ({ currentMonth, currentYear }: IFilters) =>
    `${(currentMonth + 1).toString().padStart(2, "0")}` +
    `${currentYear.toString().slice(2)}`
);

export const selectCurrentMMYYByName = createSelector(
  [selectFilters],
  ({ currentMonth, currentYear }) => {
    return `${months[currentMonth]}, ${currentYear}`;
  }
);

export const selectDaysInCurrentMonth = createSelector(
  [selectFilters],
  ({ currentMonth, currentYear }) =>
    moment({ month: currentMonth, year: currentYear }).daysInMonth()
);

export const selectLabeledDaysInMonth = createSelector(
  [selectFilters, selectDaysInCurrentMonth],
  ({ currentMonth }, daysInMonth) => {
    // const month = moment({ month: currentMonth }).format('MMM');
    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
      // result.push(`${day.toString().padStart(2, '0')}${month}`);
      result.push(`${day.toString().padStart(2, "0")}`);
    }
    return result;
  }
);

export const selectSearchText = createSelector(
  [selectFilters],
  ({ searchText }) => searchText
);

export const { setCurrentMonth, setTextFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
