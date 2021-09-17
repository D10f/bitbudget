import React from 'react';
import { connect } from 'react-redux';
import { formatAsCurrency } from '../../../utils/expenses';

import {
  selectCurrentWallet,
  selectCurrentWalletCurrency,
  selectCurrentWalletBudget
} from '../../../redux/wallets/selectors';

import {
  selectExpensesAmount,
  selectIncomeAmount,
  selectBudgetPercentage
} from '../../../redux/expenses/selectors';

import DoughnutChart from '../CategoriesBalance/DoughnutChart';

const Balance = ({
  wallet,
  currency,
  expenseAmount,
  incomeAmount,
  totalExpenses,
  budgetAmount,
  budgetPercentage
}) => {

  const getExpenseAmount = `${currency}${formatAsCurrency(expenseAmount)}`;
  const getIncomeAmount = `${currency}${formatAsCurrency(incomeAmount)}`;


  return (
    <section className="dashboard__balance">
      <h2 className="balance__title">{wallet.name}</h2>

      {/*<div className="balance__summary">
        <p>Budget: {currency}{wallet.budget}</p>
        <p>Total Expense: {getExpenseAmount}</p>
        <p>Total Income: {getIncomeAmount}</p>
      </div>*/}

      {/*
        [
          `Budget: ${currency}${wallet.budget}`,
          `Expenses: ${getExpenseAmount}`,
          `Income: ${getIncomeAmount}`,
        ]
      */}

      <div className="balance__chart">
        <DoughnutChart
          labels={[ 'Budget', 'Expense', 'Income' ]}
          data={[
            budgetAmount / 2,
            parseFloat(expenseAmount) / 100,
            parseFloat(incomeAmount) / 100,
          ]}
          backgroundColor={[ '#ff9231', '#363933', '#F9B058' ]}
          legend={{
            position: 'top',
            align: 'center',
            labels: {
              font: {
                family: 'Space Grotesk'
              }
            }
          }}
        />
      </div>

      {/*<div className="balance__chart">
        <progress
          className="balance__progress"
          max="100"
          value={budgetPercentage}
        >
          {budgetPercentage}%
        </progress>
        <p className="balance__gauge" value={budgetPercentage} />
      </div>*/}

    </section>
  );
};

const mapStateToProps = state => ({
  wallet: selectCurrentWallet(state),
  currency: selectCurrentWalletCurrency(state),
  expenseAmount: selectExpensesAmount(state),
  incomeAmount: selectIncomeAmount(state),
  budgetAmount: selectCurrentWalletBudget(state),
  budgetPercentage: selectBudgetPercentage(state)
});

export default connect(mapStateToProps)(React.memo(Balance));
