import { connect } from 'react-redux';
import useSnapshot from '../hooks/useSnapshot';
import { addExpense } from '../redux/actions/expenses';
import { selectCurrentWallet } from '../redux/selectors/expenses';
import { v4 as uuidv4 } from 'uuid';

import ExpenseForm from '../components/ExpenseForm';

const AddExpensePage = ({ addExpense, wallet, history }) => {

  const createSnapshot = useSnapshot();

  const onSubmit = (expenseData) => {
    const expense = {
      ...expenseData,
      _id: uuidv4(),
      wallet: wallet.id
    };
    addExpense(expense);
    createSnapshot().then(history.push('/expenses'));
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
  addExpense: (expense) => dispatch(addExpense(expense))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddExpensePage);
