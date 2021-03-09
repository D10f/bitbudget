import { connect } from 'react-redux';
import numeral from 'numeral';
import {
  selectCurrentWallet,
  selectIncomeAmount,
  selectExpensesAmount
} from '../redux/selectors/expenses';

const Balance = ({ wallet: { budget, currency }, incomeExpenses, expensesAmount }) => (
  <header className="balance">
    <article className="balance__card balance__card--1">
      <h3 className="balance__card-title">Budget</h3>
      <p className="balance__amount">{currency}{numeral(budget / 100).format(`0,0.00`)}</p>
    </article>
    <article className="balance__card balance__card--2">
      <h3 className="balance__card-title">Income</h3>
      <p className="balance__amount">{currency}{numeral(incomeExpenses / 100).format(`0,0.00`)}</p>
    </article>
    <article className="balance__card balance__card--3">
      <h3 className="balance__card-title">Expenses</h3>
      <p className="balance__amount">{currency}{numeral(expensesAmount / 100).format(`0,0.00`)}</p>
    </article>
  </header>
);

const mapStateToProps = (state) => ({
  wallet: selectCurrentWallet(state),
  incomeExpenses: selectIncomeAmount(state),
  expensesAmount: selectExpensesAmount(state)
});

export default connect(mapStateToProps)(Balance);
