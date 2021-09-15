import moment from 'moment';
import { createSelector } from 'reselect';

export const selectFilters = state => state.filters;

// Returns the current month and year formatted as a "MMYY" string
// e.g., July 2021 -> 0621 (note that moment counts month starting at index 0)
export const selectCurrentMMYY = createSelector(
  [selectFilters],
  ({ month, year }) => `${month.toString().padStart(2, '0')}` + `${year.toString().slice(2)}`
);

export const selectDaysInCurrentMonth = createSelector(
  [selectFilters],
  ({ month, year}) => moment({ month, year }).daysInMonth()
);

export const selectLabeledDaysInMonth = createSelector(
  [selectFilters, selectDaysInCurrentMonth],
  ({ month }, daysInMonth) => {
    const currentMonth = moment({ month }).format('MMM');
    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
      result.push(`${day.toString().padStart(2, '0')}${currentMonth}`);
    }
    return result;
  }
)
