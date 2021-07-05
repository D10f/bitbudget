import moment from 'moment';
import { createSelector } from 'reselect';

export const selectFilters = state => state.filters;

// Returns the current month formatted as a MMYY string
// export const selectCurrentMonthAsMMYY = createSelector(
//   [selectFilters],
//   (filters) => {
//     const month = moment(filters.currentMonth).month;
//     const year = moment(filters.currentMonth).year;
//     return `${}${}`;
//   }
// );
