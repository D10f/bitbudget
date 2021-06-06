import { connect } from 'react-redux';
import { startAddExpense } from '../redux/actions/expenses';
import { selectCurrentWallet } from '../redux/selectors/expenses';
import { v4 as uuidv4 } from 'uuid';

import ExpenseForm from '../components/ExpenseForm';

const AddExpensePage = ({ startAddExpense, wallet, history }) => {

  const onSubmit = (expenseData) => {
    const expense = {
      _id: uuidv4(),
      ...expenseData,
      wallet: wallet.id
    };

    startAddExpense(expense)
      .then(() => history.push('/expenses'));
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
