import moment from 'moment';
import { createSelector } from 'reselect';
import { formatAsCurrency } from '../../utils/expenses';
import { selectCurrentWallet, selectCurrentWalletBudget } from '../wallets/selectors';
import { selectFilters, selectDaysInCurrentMonth, selectLabeledDaysInMonth } from '../filters/selectors';

const selectExpenses = state => state.expenses.expenses;

/**
 * Selects the expenses for the current wallet and current month
 * @return {array} All the expenses based on current wallet and current month
 */
export const selectCurrentExpenses = createSelector(
  [selectExpenses, selectCurrentWallet, selectFilters],
  (expenses, wallet, { month, year }) => {
    return expenses.filter(expense => {
      const createdAtMoment = moment(expense.createdAt);
      return (
        expense.wallet === wallet.id &&
        createdAtMoment.month() === month &&
        createdAtMoment.year() === year
      );
    });
  }
);

/**
 * Selects the total spent amount, sorted by expense category.
 * @return {object} Object containing categories of the current dataset and their combined amounts
 * @example output: { 'travel': 200, 'food': 125, 'entertainment': 65 }
 */
export const selectAmountByCategory = createSelector(
  [selectCurrentExpenses],
  expenses => {

    return expenses.reduce((acc, expense) => {
      const { category, amount } = expense;

      return acc[category]
        ? { ...acc, [category]: parseFloat(((acc[category] + amount) / 100).toFixed(2)) }
        : { ...acc, [category]: parseFloat((amount / 100).toFixed(2)) }
    }, {});
  }
);

/**
 * Selects the total spent amount, sorted by expense day of month.
 * @return {tuple} A tuple containing two arrays of numbers, with the amounts distributed by day for all expenses
 */
export const selectAmountByDay = createSelector(
  [selectCurrentExpenses, selectDaysInCurrentMonth],
  (expenses, daysInMonth) => {
    // Chart.js expects an array of values, in this case each item represents an amount per day of
    // the month. Amount defaults to 0.
    const expenseResult = new Array(daysInMonth).fill(0);
    const incomeResult  = new Array(daysInMonth).fill(0);

    expenses.forEach(({ createdAt, amount, category }) => {
      // Get the numeric day when expense was created, substracting 1 because arrays are 0-indexed.
      const expenseDay = moment(createdAt).format('D') - 1;

      // Increase total amount for that day by the amount of current expense
      if (category.toLowerCase() === 'income') {
        incomeResult[expenseDay] += parseFloat((amount / 100).toFixed(2));
      } else {
        expenseResult[expenseDay] += parseFloat((amount / 100).toFixed(2));
      }
    });

    return [ expenseResult, incomeResult ];
  }
);

/**
 * Selects the total income amount from the expenses for the current wallet and current month
 * @return {number} The total income amount for the current dataset
 */
export const selectIncomeAmount = createSelector(
  [selectCurrentExpenses],
  expenses => expenses.reduce((total, expense) => {
    // Income is represented by negative amounts
    return expense.category.toLowerCase() === 'income' ? total + expense.amount : total;
  }, 0)
);

/**
 * Selects the total spent amount from the expenses for the current wallet and current month
 * @return {number} The total spent amount for the current dataset
 */
export const selectExpensesAmount = createSelector(
  [selectCurrentExpenses],
  expenses => expenses.reduce((total, expense) => {
    // Expenses are represented by positive amounts
    return expense.category.toLowerCase() !== 'income' ? total + expense.amount : total;
  }, 0)
);

/**
 * Selects the percentage spent by each expense categories based on total expenses
 * @return {object} An object containing categories as keys, and strings with percentage values
 */
export const selectPercentageByCategory = createSelector(
  [selectExpensesAmount, selectAmountByCategory],
  (total, categoryAmounts) => {
    // total           {number} total amount of expenses
    // categoryAmounts {object} total amount spent by category
    const expensesTotal = total / 100;
    const result = {};
    Object.entries(categoryAmounts).forEach(( [key, value] ) => {
      result[key] = ((value * 100) / expensesTotal).toFixed(2) + '%';
    });

    return result;
  }
);


/**
 * Selects the percentage spent daily based on total expenses
 * @return {object} An object containing days as keys, and strings with percentage values
 */
export const selectPercentageByDay = createSelector(
  [selectExpensesAmount, selectAmountByDay, selectLabeledDaysInMonth],
  (total, [dailyAmounts], labeledDaysInMonth) => {
    const expensesTotal = total / 100;
    const result = {};

    labeledDaysInMonth.forEach((day, idx) => {
      const dayAmount = dailyAmounts[idx];
      // Avoid zero-division errors
      result[day] = dayAmount === 0
        ? (0).toFixed(2) + '%'
        : (dayAmount * 100 / expensesTotal).toFixed(2) + '%';
    });

    return result;
  }
);

export const selectBudgetPercentage = createSelector(
  [selectCurrentWalletBudget, selectIncomeAmount, selectExpensesAmount],
  (budget, income, expense) => {
    const balance = income + expense;
    const percent = ((balance * 100) / budget) / 100; // convert from cents
    return percent.toFixed(2);
  }
);

/**
 * Select available amount in percentages over a period of time for the current month
 * @return {number[]} Array containing the percentage amount of remaining budget for the month
 */
export const selectBudgetAvailableOverTime = createSelector(
  [selectAmountByDay, selectCurrentWalletBudget],
  ([dailyAmounts], budget) => {
    let sum = 0;

    // Sum amounts every day, and calculate corresponding % for that day
    return dailyAmounts.map(amount => {
      sum += amount;
      const percentageConsumed = (sum * 100 / budget);
      const percentageAvailable = 100 - percentageConsumed;
      return Math.max(Number(percentageAvailable.toFixed(2)), 0.00);
    });
  }
);
