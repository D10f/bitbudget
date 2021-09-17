import { connect } from 'react-redux';
import { startUpdateExpense, startRemoveExpense } from '../../redux/expenses/actions';

import ExpenseForm from './ExpenseForm';

const EditExpense = ({ expense, updateExpense, removeExpense, history }) => {

  const onSubmit = ({ createdAt, title, amount, description, category }) => {

    const updated = {
      previousCreatedAt: expense.createdAt,
      createdAt: createdAt.toString(),
      title,
      amount: parseFloat(amount, 10) * 100,
      description,
      category,
      wallet: expense.wallet
    };

    updateExpense({ id: expense.id, ...updated })
      .then(done => {
        if (done) history.push('/');
      });
  };

  const handleRemove = () => {
    removeExpense(expense.id);
    history.push('/');
  };

  return (
    <section className="expense-page">
      <h2 className="has-text-center py-2">{`Edit Expense "${expense.title}"`}</h2>
      <ExpenseForm
        handleRemove={handleRemove}
        onSubmit={onSubmit}
        expense={expense}
      />
    </section>
  );
};

const mapStateToProps = (state, props) => ({
  expense: state.expenses.expenses.find(exp => exp.id === props.match.params.id)
});

const mapDispatchToProps = dispatch => ({
  updateExpense: expense => dispatch(startUpdateExpense(expense)),
  removeExpense: id => dispatch(startRemoveExpense(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditExpense);
