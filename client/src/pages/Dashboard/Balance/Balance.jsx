import React from 'react';
import { connect } from 'react-redux';
import { formatAsCurrency } from '../../../utils/expenses';
import { selectExpensesAmount, selectBudgetAvailable } from '../../../redux/expenses/selectors';
import { selectLabeledDaysInMonth } from '../../../redux/filters/selectors';
import { selectCurrentWallet, selectCurrentWalletCurrency } from '../../../redux/wallets/selectors';

import LineChart from './LineChart';

const Balance = ({ wallet, currency, expenseAmount, daysInMonth, dailyBudgetAvailable }) => {

  const getExpenseAmount = () => `${currency}${formatAsCurrency(expenseAmount)}`;

  const budgetDataset = {
    data: dailyBudgetAvailable,
    backgroundColor: '#ffc58c',
    borderColor: '#ffc58c',
    borderWidth: 1,
    fill: true,
    tension: 0.4
  };

  const scaleX = {
    grid: {
      drawTicks: false,
      display: false,
    },
    ticks: {
      callback: () => ''
    }
  };

  const scaleY = {
    beginAtZero: false,
    grid: {
      display: false
    },
    ticks: {
      callback: () => ''
    }
  };

  return (
    <section className="dashboard__balance">
    <h2 className="balance__title">{wallet.name}</h2>
    <p className="balance__budget">Budget: {currency}{wallet.budget}</p>
    <p className="balance__expenses">Total Expenses: {getExpenseAmount()}</p>
      <LineChart
        labels={daysInMonth}
        base="50"
        datasets={[budgetDataset]}
        scaleX={scaleX}
        scaleY={scaleY}
        legend={{ display: false }}
      />
    </section>
  );
};

// const getIncomeAmount = () => `${currency}${formatAsCurrency(incomeAmount)}`;

const mapStateToProps = state => ({
  wallet: selectCurrentWallet(state),
  currency: selectCurrentWalletCurrency(state),
  expenseAmount: selectExpensesAmount(state),
  daysInMonth: selectLabeledDaysInMonth(state),
  dailyBudgetAvailable: selectBudgetAvailable(state)
});

export default connect(mapStateToProps)(React.memo(Balance));
