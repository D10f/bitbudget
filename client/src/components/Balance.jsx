import { useCallback } from 'react';
import { connect } from 'react-redux';
import { formatAsCurrency } from '../utils/expenses';
import { selectIncomeAmount, selectExpensesAmount } from '../redux/selectors/expenses';
import { selectCurrentWallet } from '../redux/selectors/wallets';

const Balance = ({ wallet: { budget, currency }, incomeAmount, expenseAmount }) => {

  const getAvailableBudget = useCallback(() => {
    const percentage = (expenseAmount - incomeAmount) * 100 / budget;
    const normalizedPercentage = Math.max(Math.floor(percentage), 0);
    const formattedBudget = formatAsCurrency(budget);

    return budget > 0
      ? `${currency}${formattedBudget} (${normalizedPercentage}%)`
      : `${currency}0.00`;

  }, [budget, incomeAmount, expenseAmount]);

  const getIncomeAmount = useCallback(() => {
    return `${currency}${formatAsCurrency(incomeAmount)}`;
  }, [incomeAmount]);

  const getExpenseAmount = useCallback(() => {
    return `${currency}${formatAsCurrency(expenseAmount)}`;
  }, [expenseAmount]);

  return (
    <header className="balance mb2">
      <article className="balance__card balance__card--1">
        <h3 className="balance__card-title">Budget</h3>
        <p className="balance__amount">{getAvailableBudget()}</p>
      </article>
      <article className="balance__card balance__card--2">
        <h3 className="balance__card-title">Income</h3>
        <p className="balance__amount">{getIncomeAmount()}</p>
      </article>
      <article className="balance__card balance__card--3">
        <h3 className="balance__card-title">Expenses</h3>
        <p className="balance__amount">{getExpenseAmount()}</p>
      </article>
    </header>
  );
};

const mapStateToProps = (state) => ({
  wallet: selectCurrentWallet(state),
  incomeAmount: selectIncomeAmount(state),
  expenseAmount: selectExpensesAmount(state)
});

export default connect(mapStateToProps)(Balance);
