import moment from 'moment';
import { createSelector } from 'reselect';

const selectExpenses = state => state.expenses;
const selectFilters = state => state.filters;
const selectWallets = state => state.wallets;

export const selectCurrentWallet = createSelector(
  [selectWallets],
  wallets => wallets.find(wallet => wallet.isCurrent)
);

export const selectCurrentWalletExpenses = createSelector(
  [selectExpenses, selectCurrentWallet],
  (expenses, currentWallet) => {
    return expenses.filter(expense => {
      return expense.wallet === currentWallet.id;
    });
  }
);

export const selectExpenseItems = createSelector(
  [selectCurrentWalletExpenses, selectFilters],
  (expenses, { text, startDate, endDate }) => {
    return expenses.filter(expense => {
      const createdAtMoment = moment(expense.createdAt);
      const startDateMatch = startDate ? createdAtMoment.isSameOrAfter(startDate, 'day') : true;
      const endDateMatch = endDate ? createdAtMoment.isSameOrBefore(endDate, 'day') : true;
      const textMatch = text ? expense.title.toLowerCase().includes(text.toLowerCase()) : true;

      return startDateMatch && endDateMatch && textMatch;
    });
  }
);

export const selectSortedExpenses = createSelector(
  [selectExpenseItems, selectFilters],
  (expenses, { sortBy, sortDesc }) => {
    return expenses.sort((a, b) => {

      // Check if sortBy value should be lowercased for consistent results
      if (sortBy === 'title' || sortBy === 'description' || sortBy === 'category') {
        return sortDesc
          ? a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
          : a[sortBy].toLowerCase() > b[sortBy].toLowerCase();
      };

      // Cases where sorting does not involve strings.
      return sortDesc
        ? a[sortBy] < b[sortBy]
        : a[sortBy] > b[sortBy];
    });
  }
);

export const selectCurrentMonthExpenses = createSelector(
  [selectExpenses],
  expenses => {
    const firstOfMonth = moment().startOf('month');
    const lastOfMonth = moment().endOf('month');

    return expenses.filter(({ createdAt }) => {
      const createdAtMoment = moment(createdAt);
      return (
        createdAtMoment.isSameOrAfter(firstOfMonth, 'day') &&
        createdAtMoment.isSameOrBefore(lastOfMonth, 'day')
      );
    });
  }
);

export const selectLastMonthExpenses = createSelector(
  [selectExpenses],
  expenses => {
    const firstOfMonth = moment().subtract(1, 'month').startOf('month');
    const lastOfMonth = moment().subtract(1, 'month').endOf('month');

    return expenses.filter(({ createdAt }) => {
      const createdAtMoment = moment(createdAt);
      return (
        createdAtMoment.isSameOrAfter(firstOfMonth, 'day') &&
        createdAtMoment.isSameOrBefore(lastOfMonth, 'day')
      );
    });
  }
);

export const selectIncomeAmount = createSelector(
  [selectCurrentWalletExpenses],
  (expenses) => expenses.reduce((acc, val) => {
    return val.amount > 0 ? acc + val.amount : 0;
  }, 0)
);

export const selectExpensesAmount = createSelector(
  [selectCurrentWalletExpenses],
  (expenses) => expenses.reduce((acc, val) => {
    return val.amount < 0 ? acc + val.amount : 0;
  }, 0)
);
