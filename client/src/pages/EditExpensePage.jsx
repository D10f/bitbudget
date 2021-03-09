import { connect } from 'react-redux';
import useSnapshot from '../hooks/useSnapshot';
import { updateExpense } from '../redux/actions/expenses';
import ExpenseForm from '../components/ExpenseForm';

const EditExpensePage = ({ updateExpense, expense, history }) => {

  const createSnapshot = useSnapshot();

  const onSubmit = (expenseData) => {
    const updatedExpense = {
      ...expenseData,
      _id: expense._id,
      wallet: expense.wallet
    }
    updateExpense(updatedExpense);
    createSnapshot().then(history.push('/expenses'));
  };

  return (
    <section className="expense-page">
      <button className="expense-page__deletebtn">-</button>
      <h3>Edit Expense</h3>
      <ExpenseForm
        expense={expense}
        onSubmit={onSubmit}
      />
    </section>
  );
};

const mapStateToProps = (state, props) => ({
  expense: state.expenses.find(expense => expense._id === props.match.params.id)
});

const mapDispatchToProps = (dispatch) => ({
  updateExpense: (expense) => dispatch(updateExpense(expense))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
