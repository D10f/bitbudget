import { useEffect } from 'react';
import { connect } from 'react-redux';
import { selectCurrentWallet } from '../redux/selectors/wallets';
import Balance from '../components/Balance';
import Summary from '../components/Summary';
import ExpenseMonthPicker from '../components/ExpenseMonthPicker';
import { fetchExpenses } from '../redux/actions/expenses';

const Dashboard = ({ currentMonth, currentWallet, fetchExpenses }) => {

  useEffect(() => {
    const month = currentMonth.month.toString();
    const year = currentMonth.year.toString();
    const currentMMYY = `${month.padStart(2, '0')}` + `${year.slice(2)}`;
    fetchExpenses(currentWallet.id, [currentMMYY]);
  }, [currentMonth, currentWallet]);

  // Consider adding a loading animation!

  return (
    <>
      <Balance />
      <ExpenseMonthPicker />
      <Summary />
    </>
  );
};

const mapStateToProps = state => ({
  currentMonth: state.filters.currentMonth,
  currentWallet: selectCurrentWallet(state)
});

const mapDispatchToProps = dispatch => ({
  fetchExpenses: (walletId, ranges) => dispatch(fetchExpenses(walletId, ranges))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
