import { connect } from 'react-redux';
import { startAddExpense } from '../redux/actions/expenses';
import { selectCurrentWallet } from '../redux/selectors/wallets';
import moment from 'moment';
// import { v4 as uuidv4 } from 'uuid';
// _id: uuidv4(),

import ExpenseForm from '../components/ExpenseForm';

const AddExpensePage = ({ startAddExpense, wallet, history }) => {

  const onSubmit = (expenseData) => {
    const expense = {
      ...expenseData,
      wallet: wallet.id
    };

    startAddExpense(expense)
      .then(done => {
        if (done) history.push('/expenses');
      });
  };

  return (
    <section className="expense-page">
      <h3>Create New Expense</h3>
      <ExpenseForm onSubmit={onSubmit} />
    </section>
  );
};

const mapStateToProps = (state) => ({
  wallet: selectCurrentWallet(state)
});

const mapDispatchToProps = (dispatch) => ({
  startAddExpense: (expense) => dispatch(startAddExpense(expense))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddExpensePage);
