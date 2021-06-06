import { connect } from 'react-redux';
import { startUpdateExpense, startRemoveExpense } from '../redux/actions/expenses';
import ExpenseForm from '../components/ExpenseForm';

const EditExpensePage = ({ startUpdateExpense, startRemoveExpense, expense, history }) => {

  const handleDelete = (e) => {
    startRemoveExpense(expense._id)
      .then(history.push('/expenses'));
  };

  const onSubmit = (expenseData, navigateOnSave) => {
    const updatedExpense = {
      ...expenseData,
      _id: expense._id,
      wallet: expense.wallet
    };

    startUpdateExpense(updatedExpense)
      .then(() => {
        if (navigateOnSave) {
          history.push('/expenses');
        }
      })
  };

  return (
    <section className="expense-page">
      <button
        onClick={handleDelete}
        className="expense-page__deletebtn"
      >-
      </button>
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
  startUpdateExpense: (expense) => dispatch(startUpdateExpense(expense)),
  startRemoveExpense: (expenseId) => dispatch(startRemoveExpense(expenseId))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
