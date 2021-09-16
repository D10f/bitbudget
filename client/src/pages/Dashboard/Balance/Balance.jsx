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

      <div className="balance__chart">
        <DoughnutChart
          labels={[
            `Budget: ${currency}${wallet.budget}`,
            `Expenses: ${getExpenseAmount}`,
            `Income: ${getIncomeAmount}`,
          ]}
          data={[
            budgetAmount / 2,
            formatAsCurrency(expenseAmount),
            formatAsCurrency(incomeAmount),
          ]}
          backgroundColor={[ '#ff9231', '#363933', 'lightgray' ]}
          legend={{
            position: 'top',
            align: 'start',
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
